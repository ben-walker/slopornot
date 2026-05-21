import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { SetWithImages } from "./schemas";
import { Type } from "@fastify/type-provider-typebox";
import { config } from "src/config";

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
        images: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!set) {
      return reply.notFound();
    }

    return {
      ...set,
      images: set.images.map(({ storage_key, ...image }) => ({
        ...image,
        storage_url: `${config.IMAGE_PUBLIC_URL}/${storage_key}`,
      })),
    };
  });
};

export { sets };
