import type { ImageEntry, PerformanceTier } from "./types";
import { createMulberry32, hashSeed } from "src/utils/random";
import type { GetSetsDate200ImagesItem } from "src/api/generated";
import { titleBuckets } from "./constants";

const buildImageEntry = (image: GetSetsDate200ImagesItem): ImageEntry => ({
  id: image.id,
  isAi: image.is_ai,
  storageUrl: image.storage_url,
});

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

const clampImageIndex = (index: number, maximum: number) => {
  return Math.max(0, Math.min(index, maximum - 1));
};

const getTitle = (correctCount: number, totalRounds: number): string => {
  const ratio = correctCount / totalRounds;
  const bucket = titleBuckets[getBucketKey(ratio)];

  return bucket[Math.floor(Math.random() * bucket.length)] ?? "Thanks for playing today!";
};

const shuffleImages = (images: ImageEntry[], seed: string): ImageEntry[] => {
  const random = createMulberry32(hashSeed(seed));
  const result = [...images];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i];
    const b = result[j];

    if (a !== undefined && b !== undefined) {
      result[i] = b;
      result[j] = a;
    }
  }

  return result;
};

export {
  buildImageEntry,
  clampImageIndex,
  getTitle,
  shuffleImages,
};
