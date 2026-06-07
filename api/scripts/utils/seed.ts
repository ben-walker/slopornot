import { addDays, format } from "date-fns";

const getAlternatingBooleans = (length: number): boolean[] => (
  [
    ...Array.from({ length: length / 2 }, () => true),
    ...Array.from({ length: length / 2 }, () => false),
  ]
);

const getAttribution = (isAi: boolean) => isAi
  ? {
      model: "seed/seed-model/v2.2",
    }
  : {
      source_id: `seed-${crypto.randomUUID()}`,
      source_url: "https://unsplash.com/photos/seed",
      author_name: "Seed Photographer",
      author_url: "https://unsplash.com/@seed",
    };

const getConsecutiveDates = (length: number) => (
  Array.from({ length }, (_, i) => {
    const date = addDays(new Date(), i);

    return format(date, "yyyy-MM-dd");
  })
);

/**
 * Shaped to pair with IMAGE_PUBLIC_URL=https://picsum.photos/seed in local dev,
 * so the assembled URL resolves to a real Picsum image.
 */
const getSeededImageKey = () => `${crypto.randomUUID()}/800/600`;

export {
  getAlternatingBooleans,
  getAttribution,
  getConsecutiveDates,
  getSeededImageKey,
};
