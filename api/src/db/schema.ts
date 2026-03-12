import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const sets = pgTable("sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").unique().notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  set_id: uuid("set_id").references(() => sets.id).notNull(),
  storage_url: text("storage_url").notNull(),
  is_ai: boolean("is_ai").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
const setsRelations = relations(sets, ({ many }) => ({
  images: many(images),
}));

const imagesRelations = relations(images, ({ one }) => ({
  set: one(sets, {
    fields: [images.set_id],
    references: [sets.id],
  }),
}));

export {
  images,
  sets,
  imagesRelations,
  setsRelations,
};
