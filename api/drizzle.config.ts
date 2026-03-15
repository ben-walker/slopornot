import { config } from "./src/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/db/schema.ts",
  verbose: true,
});
