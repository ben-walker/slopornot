import type { ImageEntry, ImagePair, PerformanceTier } from "./types";
import type { GetSetsDate200ImagesItem } from "src/api/generated";
import { titleBuckets } from "./constants";

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

    // TODO: could swap images if a re-render happens, make stable
    return Math.random() < 0.5
      ? { left: aiImage, right: realImage }
      : { left: realImage, right: aiImage };
  });
};

const getBucketKey = (ratio: number): PerformanceTier => {
  if (ratio === 1) {
    return "perfect";
  }
  if (ratio >= 0.8) {
    return "great";
  }
  if (ratio >= 0.6) {
    return "good";
  }
  if (ratio >= 0.4) {
    return "ok";
  }
  if (ratio >= 0.2) {
    return "poor";
  }
  return "terrible";
};

const getTitle = (correctCount: number, totalRounds: number): string => {
  const ratio = correctCount / totalRounds;
  const bucket = titleBuckets[getBucketKey(ratio)];

  return bucket[Math.floor(Math.random() * bucket.length)] ?? "Thanks for playing today!";
};

export {
  buildImagePairs,
  getTitle,
};
