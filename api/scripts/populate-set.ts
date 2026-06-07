import * as schema from "src/db/schema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { addDays, format } from "date-fns";
import { Type } from "typebox";
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
const MIN_AI = 3;
const MAX_AI = 7;
const FETCH_TIMEOUT_MS = 30_000;
const AI_IMAGE_MODEL = "fal-ai/flux-pro/v1.1";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const WEBP_QUALITY = 85;
const MAX_DESCRIPTION_CHARS = 200;

const dateHash = createHash("sha256").update(targetDate).digest().readUInt8(0);
const aiCount = (dateHash % (MAX_AI - MIN_AI + 1)) + MIN_AI;

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

const UnsplashResponse = Type.Array(Type.Object({
  id: Type.String(),
  alt_description: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  urls: Type.Object({ regular: Type.String() }),
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
}));

const realRes = await unsplash.get("photos/random", { searchParams: { count: SET_SIZE, orientation: "landscape" } }).json();
const realData = Value.Parse(UnsplashResponse, realRes);

if (realData.length < SET_SIZE) {
  throw new Error(`Received ${String(realData.length)} real images, need ${String(SET_SIZE)}`);
}

const realImages: FetchedImage[] = await Promise.all(
  realData.slice(aiCount).map(async (photo) => {
    const [res] = await Promise.all([
      ky.get(photo.urls.regular, {
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
  }),
);

const truncateDescription = (text: string): string => {
  if (text.length <= MAX_DESCRIPTION_CHARS) {
    return text;
  }

  const truncated = text.slice(0, MAX_DESCRIPTION_CHARS);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
};

const aiImages: FetchedImage[] = await Promise.all(
  realData.slice(0, aiCount).map(async (photo) => {
    const prompt = [
      photo.alt_description,
      photo.description && truncateDescription(photo.description),
      "Candid photograph, natural lighting.",
    ].filter(Boolean).join(". ");

    const { image } = await generateImage({
      model: fal.image(AI_IMAGE_MODEL),
      prompt,
      aspectRatio: "4:3",
    });

    return {
      bytes: Buffer.from(image.uint8Array),
      contentType: image.mediaType,
      alt: photo.alt_description,
    };
  }),
);

const normalizeImage = async (image: FetchedImage): Promise<FetchedImage> => {
  const sharpBytes = await sharp(image.bytes)
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "center" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return {
    bytes: sharpBytes,
    contentType: "image/webp",
    alt: image.alt,
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
