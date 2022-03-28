import { CustomerMealsSelection } from './customer-meal-selection';
import Recipe from './Recipe';

interface Cook {
  date: string;
  menu: Recipe[];
}

export interface StoredPlan {
  id: 'plan';
  sort: string;
  planId: string;
  menus: Cook[];
  username: string;
}

export interface StoredMealSelection {
  id: `plan-${string}-selection`;
  sort: string;
  selection: CustomerMealsSelection[number];
}
