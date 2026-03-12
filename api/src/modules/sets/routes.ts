import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";

const sets: FastifyPluginCallbackTypebox = (app) => {
  app.get("/:date", {
    schema: {
      params: Type.Object({
        date: Type.String({ format: "date" }),
      }),
    },
  }, async (request, reply) => {
    const { date } = request.params;

    const set = await app.db.query.sets.findFirst({
      where: (sets, { eq }) => eq(sets.date, date),
      with: {
        images: {
          columns: {
            is_ai: false, // Excluded from response to prevent cheating
          },
        },
      },
    });

    if (!set) {
      return reply.notFound();
    }

    return set;
  });
};

export { sets };
