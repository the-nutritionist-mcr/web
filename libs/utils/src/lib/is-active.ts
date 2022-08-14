import { StandardPlan } from '@tnmw/types';

const individualPlanIsActive = (cookDate: Date, plan: StandardPlan) => {
  const pauseStart = plan.pauseStart && new Date(plan.pauseStart);
  const pauseEnd = plan.pauseEnd && new Date(plan.pauseEnd);
  const startDate = plan.startDate && new Date(plan.startDate);

  if (
    plan.subscriptionStatus === 'cancelled' ||
    plan.subscriptionStatus === 'in_trial'
  ) {
    return false;
  }

  if (plan.subscriptionStatus === 'paused' && !pauseEnd) {
    return false;
  }

  if (
    plan.subscriptionStatus === 'future' &&
    startDate &&
    cookDate > startDate
  ) {
    return true;
  }

  if (
    plan.subscriptionStatus === 'future' &&
    startDate &&
    cookDate <= startDate
  ) {
    return false;
  }

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

export const isActive = (cookDate: Date, plans: StandardPlan[]): boolean =>
  !plans.some((plan) => !individualPlanIsActive(cookDate, plan));
