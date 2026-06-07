import { images, sets } from "src/db/schema";
import type { Static } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { createSelectSchema } from "drizzle-orm/typebox";

const Set = createSelectSchema(sets);
const Image = createSelectSchema(images);

const RealAttribution = Type.Object({
  kind: Type.Literal("real"),
  source_id: Type.String(),
  source_url: Type.String(),
  author_name: Type.String(),
  author_url: Type.String(),
});

const AiAttribution = Type.Object({
  kind: Type.Literal("ai"),
  model: Type.String(),
});

const Attribution = Type.Union([RealAttribution, AiAttribution]);
type Attribution = Static<typeof Attribution>;

const ImageResponse = Type.Intersect([
  Type.Omit(Image, [
    "storage_key",
    "source_id",
    "source_url",
    "author_name",
    "author_url",
    "model",
  ]),
  Type.Object({
    storage_url: Type.String(),
    attribution: Attribution,
  }),
]);

const SetWithImages = Type.Object({
  ...Set.properties,
  images: Type.Array(ImageResponse),
});

export {
  type Attribution,
  SetWithImages,
};
