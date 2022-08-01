const getClosingDate = (date: Date) => {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + 1);

  if (newDate.getDay() !== 3) {
    return getClosingDate(newDate);
  }

  newDate.setHours(12, 0, 0);

  return newDate;
};

export const getClosedOrOpenStatus = (
  now: Date,
  data:
    | { published: boolean; available: true; date: Date }
    | { available: false }
    | undefined
) => {
  if (!data) {
    return false;
  }

  if (!data.available) {
    return false;
  }

  if (!data.published) {
    return false;
  }

  const planStart = data.date;

  const closingDate = getClosingDate(planStart);

  return now < closingDate;
};
