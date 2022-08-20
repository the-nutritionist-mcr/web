import { MealPlanGeneratedForIndividualCustomer, Recipe } from '@tnmw/types';

export const updateRecipeInSelection = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  recipe: Recipe,
  deliveryIndex: number,
  planIndex: number,
  mealIndex: number
) => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) =>
      deliveryIndex !== dIndex
        ? delivery
        : {
            ...delivery,
            plans: delivery.plans.map((plan, pIndex) =>
              planIndex === pIndex && plan.status === 'active'
                ? {
                    ...plan,
                    meals: plan.meals.map((meal, mIndex) =>
                      mIndex !== mealIndex ? meal : { ...meal, recipe: recipe }
                    ),
                  }
                : plan
            ),
          }
    ),
  };
};

export const deleteRecipeInSelection = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  deliveryIndex: number,
  planIndex: number,
  mealIndex: number
) => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) =>
      deliveryIndex !== dIndex
        ? delivery
        : {
            ...delivery,
            plans: delivery.plans.map((plan, pIndex) =>
              planIndex === pIndex && plan.status === 'active'
                ? {
                    ...plan,
                    meals: plan.meals.filter(
                      (_, mIndex) => mIndex !== mealIndex
                    ),
                  }
                : plan
            ),
          }
    ),
  };
};
