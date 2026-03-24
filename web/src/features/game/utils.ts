import type { ImageEntry, ImagePair } from "./types";
import type { GetSetsDate200ImagesItem } from "src/api/generated";

const buildImageEntry = (image: GetSetsDate200ImagesItem): ImageEntry => ({
  id: image.id,
  isAi: image.is_ai,
  storageUrl: image.storage_url,
});

const buildImagePairs = (images?: GetSetsDate200ImagesItem[]): ImagePair[] => {
  if (!images?.length) {
    return [];
  }

  const aiImages = images.filter(({ is_ai }) => is_ai);
  const realImages = images.filter(({ is_ai }) => !is_ai);

  if (aiImages.length !== realImages.length) {
    throw new Error(`Expected equal AI and real images, got ${String(aiImages.length)} AI and ${String(realImages.length)} real`);
  }

  return aiImages.map((ai, index) => {
    const real = realImages[index];

    if (!real) {
      throw new Error(`Missing real image at index ${String(index)}`);
    }

    const aiImage = buildImageEntry(ai);
    const realImage = buildImageEntry(real);

    return Math.random() < 0.5
      ? { left: aiImage, right: realImage }
      : { left: realImage, right: aiImage };
  });
};

export {
  buildImagePairs,
};
