import { Meal } from './meal';

export interface MealCategory {
  title: string;
  maxMeals: number;
  options: Meal[][];
}

export interface MealCategoryWithSelections extends MealCategory {
  selections: Meal[][];
}
