import {
  MealPlanGeneratedForIndividualCustomer,
  StandardPlan,
} from '@tnmw/types';
import { totalFromSamePlan } from './total-from-same-plan';

export const countRemainingMeals = (
  selections: MealPlanGeneratedForIndividualCustomer,
  plans: StandardPlan[]
): { [plan: string]: number } => {
  const nonExtraIndexes = plans.reduce<number[]>(
    (indexes, item, index) => (!item.isExtra ? [...indexes, index] : indexes),
    []
  );

  const currentPlanTotals = Object.fromEntries(
    plans
      .map((plan) => [
        plan.name,
        plan.totalMeals - totalFromSamePlan(plan, selections),
      ])
      .filter((_, index) => nonExtraIndexes.includes(index))
  );

  return currentPlanTotals;
};
