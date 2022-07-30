const getClosingDate = (date: Date) => {
  let newDate = new Date(date.valueOf());
  do {
    newDate.setDate(newDate.getDate() + 1);
  } while (newDate.getDay() !== 3);

  newDate.setHours(12, 0, 0);

  return newDate;
};

export const getClosedOrOpenStatus = (
  now: Date,
  data: { available: true; date: Date } | { available: false } | undefined
) => {
  if (!data) {
    return false;
  }

  if (!data.available) {
    return false;
  }

  const planStart = data.date;

  const closingDate = getClosingDate(planStart);

  return now < closingDate;
};
