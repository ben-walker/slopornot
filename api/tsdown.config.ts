import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/main.ts",
    "./scripts/db-migrate.ts",
  ],
  format: "esm",
  outDir: "dist",
  platform: "node",
});
