export type PlanLabels =
  | 'Equilibrium'
  | 'Mass'
  | 'Micro'
  | 'Ultra Micro'
  | 'Low-CHO'
  | 'Seasonal Soup'
  | 'Breakfast'
  | 'Snacks';

export type ExtrasLabels =
  | 'Breakfast'
  | 'Snack'
  | 'Large Snack'
  | 'Seasonal Soup';

export interface Item<T extends PlanLabels | ExtrasLabels> {
  name: T;
  quantity: number;
  isExtra?: boolean;
}

export interface Delivery {
  items: Item<PlanLabels>[];
  extras: Item<ExtrasLabels>[];
}

export interface PlanConfiguration {
  planType: PlanLabels;
  daysPerWeek: DaysPerWeek;
  mealsPerDay: number;
  totalPlans: number;
  deliveryDays: string[];
  extrasChosen: ExtrasLabels[];
}

export interface CustomerPlan {
  deliveries: Delivery[];
  configuration: PlanConfiguration;
}

export interface PlannerConfig {
  planLabels: PlanLabels[];
  extrasLabels: ExtrasLabels[];
  defaultDeliveryDays: string[];
}

export type DaysPerWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
