import {
  MealPlanGeneratedForIndividualCustomer,
  StandardPlan,
} from '@tnmw/types';
import { countMealsInPlans } from './count-plans';

export const totalFromSamePlan = (
  standardPlan: StandardPlan,
  selectedMeals: MealPlanGeneratedForIndividualCustomer
) => {
  return selectedMeals.deliveries.reduce((totalFromDeliveries, delivery) => {
    if (delivery.paused) {
      return totalFromDeliveries;
    }
    return (
      totalFromDeliveries +
      countMealsInPlans(
        ...delivery.plans.filter(
          (plan) => plan.status === 'active' && plan.planId === standardPlan.id
        )
      )
    );
  }, 0);
};
