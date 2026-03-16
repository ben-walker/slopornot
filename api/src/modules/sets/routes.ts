import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { SetWithImages } from "./schemas";
import { Type } from "@fastify/type-provider-typebox";

const sets: FastifyPluginCallbackTypebox = (app) => {
  app.get("/:date", {
    schema: {
      params: Type.Object({
        date: Type.String({ format: "date" }),
      }),
      response: {
        200: SetWithImages,
      },
    },
  }, async (request, reply) => {
    const { date } = request.params;

    const set = await app.db.query.sets.findFirst({
      where: { date },
      with: {
        images: true,
      },
    });

    if (!set) {
      return reply.notFound();
    }

    return set;
  });
};

export { sets };
