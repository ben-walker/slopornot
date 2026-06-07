import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { SetWithImages } from "./schemas";
import { Type } from "@fastify/type-provider-typebox";
import { config } from "src/config";
import { toAttribution } from "./utils";

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

    return reply
      .header("cache-control", "public, max-age=300, s-maxage=600")
      .send({
        ...set,
        images: set.images.map(image => ({
          ...image,
          storage_url: `${config.IMAGE_PUBLIC_URL}/${image.storage_key}`,
          attribution: toAttribution(image),
        })),
      });
  });
};

export { sets };
