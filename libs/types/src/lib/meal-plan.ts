import { BackendCustomer } from './backend-customer';
import Recipe from './Recipe';

export interface DeliveryMeal {
  isExtra: false;
  recipe: Recipe;
  chosenVariant: string;
}

export interface DeliveryExtra {
  isExtra: true;
  extraName: string;
}

export type DeliveryItem = DeliveryMeal | DeliveryExtra;

interface CancelledPlan {
  status: 'cancelled';
  id: string;
  name: string;
}

interface FuturePlan {
  status: 'future';
  name: string;
  id: string;
  startsOn?: Date;
}

interface PausedPlan {
  id: string;
  status: 'paused';
  name: string;
  pausedUntil?: Date;
  pausedFrom?: Date;
}

export interface ActivePlanWithMeals {
  status: 'active';
  id: string;
  name: string;
  planId: string;
  meals: DeliveryItem[];
  pausingOn?: Date;
  isExtra: boolean;
  cancellingOn?: Date;
}

interface InTrialPlan {
  status: 'in_trial';
  id: string;
  name: string;
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

export interface MealSelectionPayload {
  id: string;
  selection: MealPlanGeneratedForIndividualCustomer;
}

export const assertsMealSelectPayload: (
  thing: unknown
) => asserts thing is MealSelectionPayload = (thing) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thingAsAny = thing as any;

  assertsMealSelectionForIndividualCustomer(thingAsAny.selection);
};

export const assertsMealSelectionForIndividualCustomer: (
  thing: unknown
) => asserts thing is MealPlanGeneratedForIndividualCustomer = (thing) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thingAsAny = thing as any;

  if (typeof thingAsAny.customer === 'undefined') {
    throw new TypeError('Customer was undefined');
  }
};

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
