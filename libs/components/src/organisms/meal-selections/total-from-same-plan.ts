import { MealPlanGeneratedForIndividualCustomer } from '@tnmw/types';
import { planSize } from './plan-size';

export const totalFromSamePlan = (
  planIndex: number,
  selectedMeals: MealPlanGeneratedForIndividualCustomer
) => {
  return selectedMeals.deliveries.reduce(
    (totalFromDeliveries, delivery) =>
      totalFromDeliveries + planSize(delivery.plans[planIndex]),
    0
  );
};
