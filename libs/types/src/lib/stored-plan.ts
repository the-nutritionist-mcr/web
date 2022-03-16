import { CustomerMealsSelection } from './customer-meal-selection';
import Recipe from './Recipe';

interface Cook {
  date: Date;
  menu: Recipe[];
}

export interface StoredPlan {
  id: string;
  timestamp: Date;
  selections: CustomerMealsSelection;
  menus: Cook[];
  username: string;
}
