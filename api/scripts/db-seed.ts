import * as schema from "src/db/schema";
import { generateAlternatingBooleans, generateConsecutiveDates } from "./utils/seed";
import { reset, seed } from "drizzle-seed";
import { config } from "src/config";
import { drizzle } from "drizzle-orm/postgres-js";

const ENTITY_COUNT = 10;
const STORAGE_URL = "https://picsum.photos/800/600";

const db = drizzle(config.DATABASE_URL, {
  schema,
  relations: schema.relations,
});

await reset(db, schema);
await seed(db, schema).refine(funcs => ({
  sets: {
    count: ENTITY_COUNT,
    columns: {
      date: funcs.valuesFromArray({ values: generateConsecutiveDates(ENTITY_COUNT) }),
    },
  },
}));

// Manually insert images to guarantee an even split of AI and real images per set,
// since drizzle-seed cycles values across all rows rather than per-parent.
const sets = await db.query.sets.findMany();
await db.insert(schema.images).values(
  sets.flatMap(set => generateAlternatingBooleans(ENTITY_COUNT).map(is_ai => ({
    is_ai,
    set_id: set.id,
    storage_url: STORAGE_URL,
  }))),
);

await db.$client.end();
