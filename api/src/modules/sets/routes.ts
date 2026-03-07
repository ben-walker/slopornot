import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";

const sets: FastifyPluginCallbackTypebox = (app) => {
  app.get("/", () => {
    return { message: "hello world" };
  });
};

export { sets };
