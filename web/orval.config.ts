import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3000/openapi/spec",
    },
    output: {
      client: "react-query",
      target: "./src/api/generated.ts",
      override: {
        mutator: {
          path: "./src/lib/api.ts",
          name: "api",
        },
      },
    },
  },
});
