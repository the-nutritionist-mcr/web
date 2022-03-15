import { CustomerMealsSelection } from './customer-meal-selection';
import Recipe from './Recipe';

interface Cook {
  date: Date;
  recipe: Recipe[];
}

export interface StoredPlan {
  id: string;
  timestamp: Date;
  selections: CustomerMealsSelection;
  menu: Cook[];
  username: string;
}
