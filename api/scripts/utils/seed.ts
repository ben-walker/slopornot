import { addDays, format } from "date-fns";

const generateConsecutiveDates = (length: number) => (
  Array.from({ length }, (_, i) => {
    const date = addDays(new Date(), i);

    return format(date, "yyyy-MM-dd");
  })
);

export {
  generateConsecutiveDates,
};
