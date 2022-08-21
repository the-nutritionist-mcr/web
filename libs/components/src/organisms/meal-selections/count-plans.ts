import { ActivePlanWithMeals, PlanWithMeals } from '@tnmw/types';

const isActivePlan = (plan: PlanWithMeals): plan is ActivePlanWithMeals =>
  plan.status === 'active';

export const countMealsInPlans = (...plans: PlanWithMeals[]) => {
  return (
    plans
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .filter(isActivePlan)
      .reduce((total, plan) => total + plan.meals.length, 0)
  );
};
