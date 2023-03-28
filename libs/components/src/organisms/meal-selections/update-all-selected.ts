import {
  ActivePlanWithMeals,
  MealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';

export const updateAllSelectedMeals = (
  selected: ActivePlanWithMeals,
  currentSelection: MealPlanGeneratedForIndividualCustomer,
  setSelected: (newPlan: MealPlanGeneratedForIndividualCustomer) => void,
  dayIndex: number
) => {
  console.log(selected);
  setSelected({
    ...currentSelection,
    deliveries: currentSelection.deliveries.map((delivery, dIndex) => {
      return dIndex !== dayIndex || delivery.paused
        ? delivery
        : {
            ...delivery,
            plans: delivery.plans.map((plan) =>
              plan.id === selected.id ? selected : plan
            ),
          };
    }),
  });
};
