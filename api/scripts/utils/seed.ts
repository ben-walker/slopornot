const generateConsecutiveDates = (length: number) => (
  Array.from({ length }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return date.toISOString().split("T")[0];
  })
);

export {
  generateConsecutiveDates,
};
