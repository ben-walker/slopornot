import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { runtimeConfig } from "./plugins/runtime-config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    runtimeConfig(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
