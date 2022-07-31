import { StandardPlan } from '@tnmw/types';

const individualPlanIsActive = (cookDate: Date, plan: StandardPlan) => {
  const pauseStart = plan.pauseStart && new Date(plan.pauseStart);
  const pauseEnd = plan.pauseEnd && new Date(plan.pauseEnd);

  if (pauseEnd && cookDate > pauseEnd) {
    return true;
  }

  if (pauseStart && cookDate < pauseStart) {
    return true;
  }

  if (pauseStart && cookDate > pauseStart && pauseEnd && cookDate < pauseEnd) {
    return false;
  }

  if (!pauseStart && pauseEnd && cookDate < pauseEnd) {
    return false;
  }

  if (pauseStart && cookDate > pauseStart && !pauseEnd) {
    return false;
  }

  return true;
};

export const isActive = (cookDate: Date, plans: StandardPlan[]): boolean => {
  const inactive = plans.find(
    (plan) => !individualPlanIsActive(cookDate, plan)
  );

  return !inactive;
};
