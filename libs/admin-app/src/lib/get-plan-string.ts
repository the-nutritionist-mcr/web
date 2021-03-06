import { isCustomDeliveryPlan } from '@tnmw/meal-planning';
import { CustomerPlanWithoutConfiguration, PlannerConfig } from '@tnmw/types';

export const getPlanString = (
  plan: CustomerPlanWithoutConfiguration | undefined,
  config: PlannerConfig
): string => {
  if (!plan) {
    return 'Legacy';
  }

  if (isCustomDeliveryPlan(plan, config)) {
    return 'Custom';
  }

  return `${plan.configuration.planType} ${plan.configuration.mealsPerDay} (${plan.configuration.daysPerWeek} days) x ${plan.configuration.totalPlans}`;
};
