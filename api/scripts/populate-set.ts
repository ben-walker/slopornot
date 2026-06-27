import * as schema from "src/db/schema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type Static, Type } from "typebox";
import { addDays, format } from "date-fns";
import { Value } from "typebox/value";
import { createHash } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import { fal } from "@ai-sdk/fal";
import { generateImage } from "ai";
import ky from "ky";
import { parseArgs } from "node:util";
import sharp from "sharp";

const Config = Type.Object({
  DATABASE_URL: Type.String(),
  UNSPLASH_API_KEY: Type.String(),
  FAL_API_KEY: Type.String(),
  R2_ACCOUNT_ID: Type.String(),
  R2_ACCESS_KEY_ID: Type.String(),
  R2_SECRET_ACCESS_KEY: Type.String(),
  R2_BUCKET: Type.String(),
});

const clonedConfig = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined),
);
Value.Default(Config, clonedConfig);
Value.Convert(Config, clonedConfig);
Value.Clean(Config, clonedConfig);

const config = Value.Parse(Config, clonedConfig);

const { values } = parseArgs({
  options: {
    // Default to tomorrow's date
    date: { type: "string", default: format(addDays(new Date(), 1), "yyyy-MM-dd") },
  },
});
const targetDate = values.date;

const db = drizzle(config.DATABASE_URL, {
  schema,
  relations: schema.relations,
});

const existing = await db.query.sets.findFirst({ where: { date: targetDate } });
if (existing) {
  console.info(`Set for ${targetDate} already exists, exiting.`);
  await db.$client.end();
  process.exit(0);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.R2_ACCESS_KEY_ID,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY,
  },
});

const SET_SIZE = 10;
const FETCH_COUNT = 30;
const MIN_AI = 3;
const MAX_AI = 7;
const MAX_SLOT_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 30_000;
const AI_IMAGE_MODEL = "fal-ai/flux-pro/v1.1";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const WEBP_QUALITY = 85;
const MAX_DESCRIPTION_CHARS = 200;
const PHOTO_TOPICS = "nature,film,architecture-interior,street-photography,travel,people,animals,food-drink";

const dateHash = createHash("sha256").update(targetDate).digest().readUInt8(0);
const aiCount = (dateHash % (MAX_AI - MIN_AI + 1)) + MIN_AI;

console.info(`Generating set for ${targetDate}: ${String(aiCount)} AI + ${String(SET_SIZE - aiCount)} real images.`);

interface FetchedImage {
  bytes: Buffer;
  contentType: string;
  alt: string;
  attribution?: {
    sourceId: string;
    sourceUrl: string;
    authorName: string;
    authorUrl: string;
  };
}

const unsplash = ky.create({
  prefix: "https://api.unsplash.com",
  headers: { Authorization: `Client-ID ${config.UNSPLASH_API_KEY}` },
  timeout: FETCH_TIMEOUT_MS,
  retry: {
    limit: 3,
    methods: ["get"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});

const UnsplashPhoto = Type.Object({
  id: Type.String(),
  alt_description: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  urls: Type.Object({ raw: Type.String() }),
  links: Type.Object({
    html: Type.String(),
    download_location: Type.String(),
  }),
  user: Type.Object({
    name: Type.String(),
    links: Type.Object({
      html: Type.String(),
    }),
  }),
});
type UnsplashPhoto = Static<typeof UnsplashPhoto>;
type CaptionedPhoto = UnsplashPhoto & { alt_description: string };

const UnsplashResponse = Type.Array(UnsplashPhoto);

const photosRes = await unsplash.get("photos/random", { searchParams: { count: FETCH_COUNT, orientation: "landscape", topics: PHOTO_TOPICS } }).json();
const photosData = Value.Parse(UnsplashResponse, photosRes);

const hasAltText = (photo: UnsplashPhoto): photo is CaptionedPhoto =>
  Boolean(photo.alt_description);

// Shared draw-queue: every slot pulls from here, so AI and real sources stay
// disjoint and a flagged or failed draw is never reused elsewhere.
const pool = photosData.filter(hasAltText);

console.info(`Fetched ${String(photosData.length)} photos, ${String(pool.length)} usable after alt-text filter.`);

if (pool.length < SET_SIZE) {
  throw new Error(`Only ${String(pool.length)} of ${String(photosData.length)} photos had alt text, need ${String(SET_SIZE)}`);
}

const draw = (): CaptionedPhoto => {
  const photo = pool.shift();

  if (!photo) {
    throw new Error("Unsplash pool exhausted");
  }

  return photo;
};

const truncateDescription = (text: string): string => {
  if (text.length <= MAX_DESCRIPTION_CHARS) {
    return text;
  }

  const truncated = text.slice(0, MAX_DESCRIPTION_CHARS);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
};

const buildPrompt = (photo: UnsplashPhoto): string =>
  [
    photo.alt_description,
    photo.description && truncateDescription(photo.description),
    "Candid photograph, natural lighting.",
  ].filter(Boolean).join(". ");

// Each slot draws a fresh photo from the pool until one succeeds; a download
// failure swaps to another photo, up to MAX_SLOT_ATTEMPTS, then the run aborts.
const fillRealSlot = async (): Promise<FetchedImage> => {
  for (let attempt = 1; attempt <= MAX_SLOT_ATTEMPTS; attempt++) {
    const photo = draw();
    try {
      const [res] = await Promise.all([
        ky.get(`${photo.urls.raw}&w=1600&q=90&fm=jpg`, {
          timeout: FETCH_TIMEOUT_MS,
          retry: { limit: 3 },
        }),
        ky
          .get(photo.links.download_location, { headers: { Authorization: `Client-ID ${config.UNSPLASH_API_KEY}` } })
          .catch((err: unknown) => {
            console.warn(`Download trigger failed for ${photo.id}:`, err);
          }),
      ]);

      return {
        bytes: Buffer.from(await res.arrayBuffer()),
        contentType: res.headers.get("content-type") ?? "image/jpeg",
        alt: photo.alt_description,
        attribution: {
          sourceId: photo.id,
          sourceUrl: photo.links.html,
          authorName: photo.user.name,
          authorUrl: photo.user.links.html,
        },
      };
    }
    catch (err) {
      console.warn(`Real image failed (attempt ${String(attempt)}/${String(MAX_SLOT_ATTEMPTS)}) for ${photo.id}:`, err);
    }
  }

  throw new Error(`Real slot failed after ${String(MAX_SLOT_ATTEMPTS)} attempts`);
};

// A flagged (blacked-out) or failed generation swaps to a fresh photo rather
// than re-rolling the same prompt, so a persistently-flagged prompt is dropped.
const fillAiSlot = async (): Promise<FetchedImage> => {
  for (let attempt = 1; attempt <= MAX_SLOT_ATTEMPTS; attempt++) {
    const photo = draw();
    const prompt = buildPrompt(photo);
    try {
      const { image, providerMetadata } = await generateImage({
        model: fal.image(AI_IMAGE_MODEL),
        prompt,
        aspectRatio: "4:3",
      });

      const flagged = (providerMetadata.fal?.images[0] as { nsfw?: boolean } | undefined)?.nsfw === true;

      if (flagged) {
        console.warn(`AI image flagged nsfw (attempt ${String(attempt)}/${String(MAX_SLOT_ATTEMPTS)}): ${prompt}`);
        continue;
      }

      return {
        bytes: Buffer.from(image.uint8Array),
        contentType: image.mediaType,
        alt: photo.alt_description,
      };
    }
    catch (err) {
      console.warn(`AI image failed (attempt ${String(attempt)}/${String(MAX_SLOT_ATTEMPTS)}): ${prompt}`, err);
    }
  }

  throw new Error(`AI slot failed after ${String(MAX_SLOT_ATTEMPTS)} attempts`);
};

console.info(`Fetching ${String(SET_SIZE - aiCount)} real images…`);
const realImages = await Promise.all(Array.from({ length: SET_SIZE - aiCount }, fillRealSlot));

console.info(`Generating ${String(aiCount)} AI images…`);
const aiImages = await Promise.all(Array.from({ length: aiCount }, fillAiSlot));

const normalizeImage = async (image: FetchedImage): Promise<FetchedImage> => {
  const sharpBytes = await sharp(image.bytes)
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "center" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return {
    ...image,
    bytes: sharpBytes,
    contentType: "image/webp",
  };
};

const uploadImage = async (image: FetchedImage): Promise<string> => {
  const key = `sets/${targetDate}/${crypto.randomUUID()}`;

  await r2.send(new PutObjectCommand({
    Bucket: config.R2_BUCKET,
    Key: key,
    Body: image.bytes,
    ContentType: image.contentType,
  }));

  return key;
};

console.info("Normalizing and uploading images to R2…");

const normalizedRealImages = await Promise.all(realImages.map(normalizeImage));
const normalizedAiImages = await Promise.all(aiImages.map(normalizeImage));

const realRecords = await Promise.all(
  normalizedRealImages.map(async (img) => {
    if (!img.attribution) {
      throw new Error("Real image missing attribution");
    }

    return {
      storage_key: await uploadImage(img),
      is_ai: false,
      source_id: img.attribution.sourceId,
      source_url: img.attribution.sourceUrl,
      author_name: img.attribution.authorName,
      author_url: img.attribution.authorUrl,
    };
  }),
);

const aiRecords = await Promise.all(
  normalizedAiImages.map(async img => ({
    storage_key: await uploadImage(img),
    is_ai: true,
    model: AI_IMAGE_MODEL,
  })),
);

console.info("Writing set to database…");

await db.transaction(async (tx) => {
  const [set] = await tx.insert(schema.sets).values({ date: targetDate }).returning();

  if (!set) {
    throw new Error(`Failed to create set for ${targetDate}`);
  }

  const allRecords = [...realRecords, ...aiRecords];

  await tx.insert(schema.images).values(
    allRecords.map(record => ({
      ...record,
      set_id: set.id,
    })),
  );
});

console.info(
  `Populated set for ${targetDate}: ${String(realRecords.length)} real, ${String(aiRecords.length)} AI.`,
);

await db.$client.end();
