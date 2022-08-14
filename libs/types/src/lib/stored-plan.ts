import { CustomerMealsSelectionWithChargebeeCustomer } from './customer-meal-selection';
import {
  MealPlanGeneratedForIndividualCustomer,
  WeeklyCookPlan,
  WeeklyCookPlanWithoutCustomerPlans,
} from './meal-plan';
import Recipe from './Recipe';

export interface Cook {
  date: Date;
  menu: Recipe[];
}

export interface StoredPlan {
  published: boolean;
  id: 'plan';
  sort: string;
  planId: string;
  menus: Cook[];

  username: string;

  createdBy: string;
  createdOn: string;
}

export interface StoredMealSelection {
  id: `plan-${string}-selection`;
  sort: string;
  selection: CustomerMealsSelectionWithChargebeeCustomer[number];
}

export interface GetPlanResponseAdmin {
  planId: string;
  plan: WeeklyCookPlan;
  currentUserSelection: MealPlanGeneratedForIndividualCustomer;
  published: boolean;
  available: true;
  admin: true;
}

export interface GetPlanResponseNonAdmin {
  planId: string;
  plan: WeeklyCookPlanWithoutCustomerPlans;
  currentUserSelection: MealPlanGeneratedForIndividualCustomer;
  published: boolean;
  available: true;
  admin: false;
}

export interface GetPlanResponse {
  planId: string;
  cooks: Cook[];
  selections?: PlanResponseSelections;
  currentUserSelection?: StoredMealSelection;
  createdBy: string;
  createdByName: string;
  date: string;
  published: boolean;
  available: true;
}

export interface NotYetPublishedResponse {
  available: false;
  admin: false;
}

export type PlanResponseSelections =
  CustomerMealsSelectionWithChargebeeCustomer &
    { id: StoredMealSelection['id']; sort: StoredMealSelection['sort'] }[];
