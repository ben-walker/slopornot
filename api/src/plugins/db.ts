import * as schema from "src/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { config } from "src/config";
import { drizzle } from "drizzle-orm/postgres-js";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema, typeof schema.relations>;
  }
}

const db = fp((app) => {
  const db = drizzle(config.DATABASE_URL, {
    schema,
    relations: schema.relations,
  });

  app.decorate("db", db);

  app.addHook("onClose", async () => {
    await db.$client.end();
  });
});

export { db };
