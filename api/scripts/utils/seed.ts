import { addDays, format } from "date-fns";

const generateAlternatingBooleans = (length: number): boolean[] => (
  [
    ...Array.from({ length: length / 2 }, () => true),
    ...Array.from({ length: length / 2 }, () => false),
  ]
);

const generateConsecutiveDates = (length: number) => (
  Array.from({ length }, (_, i) => {
    const date = addDays(new Date(), i);

    return format(date, "yyyy-MM-dd");
  })
);

export {
  generateAlternatingBooleans,
  generateConsecutiveDates,
};
