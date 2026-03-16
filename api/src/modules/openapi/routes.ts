import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { config } from "src/config";

const openapi: FastifyPluginCallbackTypebox = (app) => {
  if (config.NODE_ENV !== "production") {
    app.get("/spec", () => app.swagger());
  }
};

export { openapi };
