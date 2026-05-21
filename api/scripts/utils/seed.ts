import { addDays, format } from "date-fns";

const getAlternatingBooleans = (length: number): boolean[] => (
  [
    ...Array.from({ length: length / 2 }, () => true),
    ...Array.from({ length: length / 2 }, () => false),
  ]
);

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
  getConsecutiveDates,
  getSeededImageKey,
};
