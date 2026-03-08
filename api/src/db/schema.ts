import { pgTable, uuid } from "drizzle-orm/pg-core";

const sets = pgTable("sets", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export {
  sets,
};
