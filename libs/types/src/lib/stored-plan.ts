import { CustomerMealsSelection } from './customer-meal-selection';
import Recipe from './Recipe';

interface Cook {
  date: string;
  menu: Recipe[];
}

export interface StoredPlan {
  id: string;
  timestamp: string;
  selections: CustomerMealsSelection;
  menus: Cook[];
  username: string;
}
