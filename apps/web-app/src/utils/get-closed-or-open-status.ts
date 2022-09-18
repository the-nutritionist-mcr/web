const getClosingDate = (date: Date): Date => {
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
    | { published: boolean; available: true; plan: { createdOn: Date } }
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

  const planStart = data.plan.createdOn;

  const closingDate = getClosingDate(planStart);

  return now < closingDate;
};
