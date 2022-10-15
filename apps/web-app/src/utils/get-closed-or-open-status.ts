import { getCookStatus } from '@tnmw/meal-planning';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
} from '@tnmw/types';

export const chooseablePlans = (
  customer: BackendCustomer,
  cooks: PlannedCook[]
) => {
  return customer.plans.filter((plan) => {
    const every = cooks.every((cook) => {
      const status = getCookStatus(cook.date, plan).status === 'active';
      return status;
    });

    return every;
  });
};

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
    | {
        published: boolean;
        available: true;
        plan: { createdOn: Date; cooks: PlannedCook[] };
        currentUserSelection?: MealPlanGeneratedForIndividualCustomer;
      }
    | { available: false }
    | undefined,
  customer: BackendCustomer
) => {
  if (!data) {
    return false;
  }

  if (!data.available) {
    return false;
  }

  if (!data.currentUserSelection) {
    return false;
  }

  if (!data.published) {
    return false;
  }
  const plans = chooseablePlans(customer, data.plan.cooks);

  if (plans.length === 0) {
    return false;
  }

  const planStart = data.plan.createdOn;

  const closingDate = getClosingDate(planStart);

  return now < closingDate;
};
