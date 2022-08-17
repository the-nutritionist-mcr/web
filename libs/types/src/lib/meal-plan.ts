import { BackendCustomer } from './backend-customer';
import Recipe from './Recipe';

interface DeliveryMeal {
  isExtra: false;
  recipe: Recipe;
}

interface DeliveryExtra {
  isExtra: true;
}

export type DeliveryItem = DeliveryMeal | DeliveryExtra;

interface CancelledPlan {
  status: 'cancelled';
}

interface FuturePlan {
  status: 'future';
  startsOn?: Date;
}

interface PausedPlan {
  status: 'paused';
  pausedUntil?: Date;
  pausedFrom?: Date;
}

export interface ActivePlanWithMeals {
  status: 'active';
  name: string;
  meals: DeliveryItem[];
  pausingOn?: Date;
  cancellingOn?: Date;
}

interface InTrialPlan {
  status: 'in_trial';
}

export type PlanWithMeals =
  | ActivePlanWithMeals
  | PausedPlan
  | FuturePlan
  | CancelledPlan
  | InTrialPlan;

export interface PlannedDelivery {
  dateCooked: Date;
  plans: PlanWithMeals[];
}

export interface MealPlanGeneratedForIndividualCustomer {
  customer: BackendCustomer;
  deliveries: PlannedDelivery[];
  wasUpdatedByCustomer: boolean;
}

export type StoredMealPlanGeneratedForIndividualCustomer =
  MealPlanGeneratedForIndividualCustomer & {
    id: string;
    sort: string;
  };

export interface PlannedCook {
  date: Date;
  menu: Recipe[];
}

export interface WeeklyCookPlan {
  customerPlans: MealPlanGeneratedForIndividualCustomer[];
  cooks: PlannedCook[];
  createdBy: string;
  createdOn: Date;
}

export type WeeklyCookPlanWithoutCustomerPlans = Omit<
  WeeklyCookPlan,
  'customerPlans'
>;

export interface StoredWeeklyCookPlan {
  id: 'plan';
  sort: string;
}
