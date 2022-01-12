import { extrasLabels, planLabels } from "../../lib/config";

export interface Item<
  T extends typeof extrasLabels[number] | typeof planLabels[number]
> {
  name: T;
  quantity: number;
}

export interface Delivery {
  items: Item<typeof planLabels[number]>[];
  extras: Item<typeof extrasLabels[number]>[];
}

export interface PlanConfiguration {
  planType: typeof planLabels[number];
  daysPerWeek: DaysPerWeek;
  mealsPerDay: number;
  totalPlans: number;
  deliveryDays: string[];
  extrasChosen: typeof extrasLabels[number][];
}

export interface CustomerPlan {
  deliveries: Delivery[];
  configuration: PlanConfiguration;
}

export interface PlannerConfig {
  planLabels: typeof planLabels[number][];
  extrasLabels: typeof extrasLabels[number][];
  defaultDeliveryDays: string[];
}

export type DaysPerWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
