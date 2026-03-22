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

const getSeededImageUrl = () => {
  const seed = crypto.randomUUID();

  return `https://picsum.photos/seed/${seed}/800/600`;
};

export {
  getAlternatingBooleans,
  getConsecutiveDates,
  getSeededImageUrl,
};
