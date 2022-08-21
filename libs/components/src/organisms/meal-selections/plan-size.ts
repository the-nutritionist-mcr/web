import { PlanWithMeals } from '@tnmw/types';

export const planSize = (plan: PlanWithMeals) => {
  if (plan.status !== 'active') {
    return 0;
  }

  return plan.meals.length;
};
