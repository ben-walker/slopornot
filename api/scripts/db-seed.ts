import * as schema from "src/db/schema";
import { reset, seed } from "drizzle-seed";
import { config } from "src/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { generateConsecutiveDates } from "./utils/seed";

const ENTITY_COUNT = 10;
const STORAGE_URL = "https://picsum.photos/800/600";

const db = drizzle(config.DATABASE_URL);

await reset(db, schema);
await seed(db, schema).refine(funcs => ({
  sets: {
    count: ENTITY_COUNT,
    columns: {
      date: funcs.valuesFromArray({ values: generateConsecutiveDates(ENTITY_COUNT) }),
    },
    with: {
      images: ENTITY_COUNT,
    },
  },
  images: {
    columns: {
      storage_url: funcs.valuesFromArray({ values: [STORAGE_URL] }),
    },
  },
}));

await db.$client.end();
