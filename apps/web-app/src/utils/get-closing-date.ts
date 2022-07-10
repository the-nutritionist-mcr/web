export const getClosingDate = (date: Date) => {
  let newDate = new Date(date.valueOf());
  do {
    newDate.setDate(newDate.getDate() + 1);
  } while (newDate.getDay() !== 4);

  newDate.setHours(12, 0, 0);

  return newDate;
};
