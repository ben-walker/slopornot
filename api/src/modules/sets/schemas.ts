import { images, sets } from "src/db/schema";
import { Type } from "@fastify/type-provider-typebox";
import { createSelectSchema } from "drizzle-orm/typebox";

const Set = createSelectSchema(sets);
const Image = createSelectSchema(images);

const ImageResponse = Type.Intersect([
  Type.Omit(Image, ["storage_key"]),
  Type.Object({ storage_url: Type.String() }),
]);

const SetWithImages = Type.Object({
  ...Set.properties,
  images: Type.Array(ImageResponse),
});

export { SetWithImages };
