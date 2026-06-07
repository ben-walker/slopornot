import { type Attribution } from "./schemas";
import { images } from "src/db/schema";

type ImageRow = typeof images.$inferSelect;

const toAttribution = (image: ImageRow): Attribution => {
  if (image.is_ai) {
    if (!image.model) {
      throw new Error(`Image ${image.id} is AI but missing model`);
    }

    return {
      kind: "ai",
      model: image.model,
    };
  }

  if (!image.source_id || !image.source_url || !image.author_name || !image.author_url) {
    throw new Error(`Image ${image.id} is real but missing attribution`);
  }

  return {
    kind: "real",
    source_id: image.source_id,
    source_url: image.source_url,
    author_name: image.author_name,
    author_url: image.author_url,
  };
};

export {
  toAttribution,
};
