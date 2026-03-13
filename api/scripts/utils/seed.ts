const generateConsecutiveDates = (length: number) => (
  Array.from({ length }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  })
);

export {
  generateConsecutiveDates,
};
