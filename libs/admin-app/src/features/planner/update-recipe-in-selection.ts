import { itemFamilies } from '@tnmw/config';
import { MealPlanGeneratedForIndividualCustomer, Recipe } from '@tnmw/types';
import { v4 } from 'uuid';

export const updateRecipeInSelection = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  recipe: Recipe,
  deliveryIndex: number,
  planIndex: number,
  mealIndex: number
): MealPlanGeneratedForIndividualCustomer => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) => {
      if (delivery.paused) {
        return delivery;
      }
      return deliveryIndex !== dIndex
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
          };
    }),
  };
};

export const deleteRecipeInSelection = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  deliveryIndex: number,
  planIndex: number,
  mealIndex: number
): MealPlanGeneratedForIndividualCustomer => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) => {
      if (delivery.paused) {
        return delivery;
      }
      return deliveryIndex !== dIndex
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
          };
    }),
  };
};

export const addPlanRowToDelivery = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  deliveryIndex: number,
  option: string
): MealPlanGeneratedForIndividualCustomer => {
  const isExtra = Boolean(
    itemFamilies.find((family) => family.name === option)?.isExtra
  );
  const id = v4();
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) => {
      if (delivery.paused) {
        return delivery;
      }
      return deliveryIndex !== dIndex
        ? delivery
        : {
            ...delivery,
            plans: [
              ...delivery.plans,
              {
                status: 'active',
                name: option,
                meals: [],
                isExtra,
                id,
                planId: id,
              },
            ],
          };
    }),
  };
};

export const removePlanRowFromDelivery = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  deliveryIndex: number,
  planIndex: number
): MealPlanGeneratedForIndividualCustomer => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) => {
      if (delivery.paused) {
        return delivery;
      }
      return deliveryIndex !== dIndex
        ? delivery
        : {
            ...delivery,
            plans: delivery.plans.filter((_, index) => planIndex !== index),
          };
    }),
  };
};

export const addRecipeToSelection = (
  currentPlan: MealPlanGeneratedForIndividualCustomer,
  deliveryIndex: number,
  planIndex: number,
  option: string,
  recipe?: Recipe
): MealPlanGeneratedForIndividualCustomer => {
  return {
    ...currentPlan,
    deliveries: currentPlan.deliveries.map((delivery, dIndex) => {
      if (delivery.paused) {
        return delivery;
      }
      return deliveryIndex !== dIndex
        ? delivery
        : {
            ...delivery,
            plans: delivery.plans.map((plan, pIndex) =>
              planIndex === pIndex && plan.status === 'active'
                ? {
                    ...plan,
                    meals: [
                      ...plan.meals,
                      recipe
                        ? { recipe, isExtra: false, chosenVariant: option }
                        : { isExtra: true, extraName: option },
                    ],
                  }
                : plan
            ),
          };
    }),
  };
};
