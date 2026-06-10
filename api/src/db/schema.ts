import {
  boolean,
  check,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";

const sets = pgTable("sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").unique().notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  set_id: uuid("set_id").references(() => sets.id).notNull(),
  storage_key: text("storage_key").notNull(),
  is_ai: boolean("is_ai").notNull(),
  source_id: text("source_id"),
  source_url: text("source_url"),
  author_name: text("author_name"),
  author_url: text("author_url"),
  model: text("model"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, table => [
  check(
    "ai_has_model",
    sql`${table.is_ai} = false OR ${table.model} IS NOT NULL`,
  ),
  check(
    "real_has_attribution",
    sql`${table.is_ai} = true OR (
      ${table.author_name} IS NOT NULL
      AND ${table.author_url} IS NOT NULL
      AND ${table.source_id} IS NOT NULL
      AND ${table.source_url} IS NOT NULL
    )`,
  ),
]);

const relations = defineRelations({ images, sets }, helpers => ({
  sets: {
    images: helpers.many.images(),
  },
  images: {
    set: helpers.one.sets({
      from: helpers.images.set_id,
      to: helpers.sets.id,
    }),
  },
}));

export {
  sets,
  images,
  relations,
};
