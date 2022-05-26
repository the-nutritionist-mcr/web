import { CustomerMealsSelectionWithChargebeeCustomer } from './customer-meal-selection';
import Recipe from './Recipe';

export interface Cook {
  date: string;
  menu: Recipe[];
}

export interface StoredPlan {
  published: boolean;
  id: 'plan';
  sort: string;
  planId: string;
  menus: Cook[];
  username: string;
}

export interface StoredMealSelection {
  id: `plan-${string}-selection`;
  sort: string;
  selection: CustomerMealsSelectionWithChargebeeCustomer[number];
}

export interface GetPlanResponse {
  planId: string;
  cooks: Cook[];
  selections?: PlanResponseSelections;
  createdBy: string;
  date: Date;
  published: boolean;
  available: true;
}

export interface NotYetPublishedResponse {
  available: false;
}

export type PlanResponseSelections =
  CustomerMealsSelectionWithChargebeeCustomer &
    { id: StoredMealSelection['id']; sort: StoredMealSelection['sort'] }[];
