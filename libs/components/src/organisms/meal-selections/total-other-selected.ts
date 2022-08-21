import { MealPlanGeneratedForIndividualCustomer } from '@tnmw/types';
import { planSize } from './plan-size';
import { totalFromSamePlan } from './total-from-same-plan';

export const totalOtherSelected = (
  selectedMeals: MealPlanGeneratedForIndividualCustomer,
  planIndex: number,
  dayIndex: number
) => {
  const allFromThisPlan = totalFromSamePlan(planIndex, selectedMeals);

  const thisPlanTotal = planSize(
    selectedMeals.deliveries[dayIndex].plans[planIndex]
  );

  return allFromThisPlan - thisPlanTotal;
};
