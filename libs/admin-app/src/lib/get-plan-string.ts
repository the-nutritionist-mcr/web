import { isCustomDeliveryPlan } from '../features/customers/distribution-generator';
import { CustomerPlan, PlannerConfig } from '../features/customers/types';

export const getPlanString = (
  plan: CustomerPlan | undefined,
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
