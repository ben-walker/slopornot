import { config } from "src/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  verbose: true,
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
