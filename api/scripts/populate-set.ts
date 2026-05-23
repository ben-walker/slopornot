import * as schema from "src/db/schema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { addDays, format } from "date-fns";
import { Type } from "typebox";
import { Value } from "typebox/value";
import { drizzle } from "drizzle-orm/postgres-js";
import ky from "ky";
import { parseArgs } from "node:util";

const Config = Type.Object({
  DATABASE_URL: Type.String(),
  PEXELS_API_KEY: Type.String(),
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

const SET_SIZE = 5;
const FETCH_TIMEOUT_MS = 30_000;

interface FetchedImage {
  bytes: Buffer;
  contentType: string;
  alt: string;
}

const pexels = ky.create({
  prefix: "https://api.pexels.com/v1",
  headers: { Authorization: config.PEXELS_API_KEY },
  timeout: FETCH_TIMEOUT_MS,
  retry: {
    limit: 3,
    methods: ["get"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});

const PexelsResponse = Type.Object({
  photos: Type.Array(Type.Object({
    src: Type.Object({ large: Type.String() }),
    alt: Type.String(),
  })),
});

const realRes = await pexels.get("curated", { searchParams: { page: 1, per_page: SET_SIZE } }).json();
const realData = Value.Parse(PexelsResponse, realRes);

const realImages: FetchedImage[] = await Promise.all(
  realData.photos.map(async (photo) => {
    const res = await ky.get(photo.src.large, {
      timeout: FETCH_TIMEOUT_MS,
      retry: { limit: 3 },
    });

    return {
      bytes: Buffer.from(await res.arrayBuffer()),
      contentType: res.headers.get("content-type") ?? "image/jpeg",
      alt: photo.alt,
    };
  }),
);

// TODO: generate 5 AI images. Plan is to seed prompts from realImages[].alt
// plus a photorealistic style suffix so the AI set matches the real set's look.
const aiImages: FetchedImage[] = [];

// TODO: normalize all images with sharp before upload (resize to common
// dimensions, strip EXIF, re-encode as webp) so file metadata can't leak which
// images are AI.

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

const realRecords = await Promise.all(
  realImages.map(async img => ({
    storage_key: await uploadImage(img),
    is_ai: false,
  })),
);

const aiRecords = await Promise.all(
  aiImages.map(async img => ({
    storage_key: await uploadImage(img),
    is_ai: true,
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
