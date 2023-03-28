import { MealPlanGeneratedForIndividualCustomer } from '@tnmw/types';
import { countMealsInPlans } from './count-plans';

export const countMeals = (
  selections: MealPlanGeneratedForIndividualCustomer
) => {
  const nonExtraMealCount = selections.deliveries.reduce(
    (totalMeals, delivery) => {
      if (delivery.paused) {
        return totalMeals;
      }
      return (
        totalMeals +
        delivery.plans.reduce(
          (mealsInDelivery, plan) =>
            (plan.status === 'active' && !plan.isExtra
              ? countMealsInPlans(plan)
              : 0) + mealsInDelivery,
          0
        )
      );
    },
    0
  );

  const extraMealCount = selections.deliveries.reduce(
    (totalMeals, delivery) => {
      if (delivery.paused) {
        return totalMeals;
      }
      return (
        totalMeals +
        delivery.plans.reduce(
          (mealsInDelivery, plan) =>
            (plan.status === 'active' && plan.isExtra
              ? countMealsInPlans(plan)
              : 0) + mealsInDelivery,
          0
        )
      );
    },
    0
  );

  return {
    meals: nonExtraMealCount,
    extras: extraMealCount,
  };
};
