import { CustomerMealsSelection } from './customer-meal-selection';
import Recipe from './Recipe';

interface Cook {
  date: string;
  menu: Recipe[];
}

export interface StoredPlan {
  id: string;
  sort: 'plan';
  timestamp: string;
  menus: Cook[];
  username: string;
}

export interface StoredMealSelection {
  id: string;
  sort: `selection-${string}`;
  selectionId: string;
  selection: CustomerMealsSelection[number];
}
