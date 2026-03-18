import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";

const openapi: FastifyPluginCallbackTypebox = (app) => {
  app.get("/spec", {
    schema: {
      hide: true,
    },
  }, () => app.swagger());
};

export { openapi };
