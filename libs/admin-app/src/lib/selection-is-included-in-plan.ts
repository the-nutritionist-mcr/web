import { PausedDelivery, Swapped } from '@tnmw/types';
import { CustomerMealDaySelection } from './generateDeliveryPlanDocumentDefinition';

export const isLegimatePause = (delivery: Swapped<PausedDelivery>) => {
  const { pausedUntil, pausedFrom } = delivery;

  if (!pausedUntil || !pausedFrom) {
    return false;
  }

  const diff = Number.parseInt(
    `${(Number(pausedUntil) - Number(pausedFrom)) / (1000 * 60 * 60 * 24)}`,
    10
  );

  return diff < 7 * 4;
};

export const selectionIsIncludedInPlan = (
  customerSelection: Swapped<CustomerMealDaySelection>
) => {
  if (!customerSelection.delivery.paused) {
    const mealCount = customerSelection.delivery.plans.reduce(
      (accum, plan) =>
        accum + (plan.status === 'active' ? plan.meals.length : 0),
      0
    );

    return mealCount > 0;
  }
  return isLegimatePause(customerSelection.delivery);
};
