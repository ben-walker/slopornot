import { config } from "src/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const db = drizzle(config.DATABASE_URL);

await migrate(db, { migrationsFolder: "./migrations" });
await db.$client.end();
