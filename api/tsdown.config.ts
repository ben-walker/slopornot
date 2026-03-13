import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "main": "./src/main.ts",
    "db-migrate": "./scripts/db-migrate.ts",
  },
  format: "esm",
  outDir: "dist",
  platform: "node",
});
