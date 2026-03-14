import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "main": "./src/main.ts",
    "db-migrate": "./scripts/db-migrate.ts",
    "populate-set": "./scripts/populate-set.ts",
  },
  format: "esm",
  outDir: "dist",
  platform: "node",
});
