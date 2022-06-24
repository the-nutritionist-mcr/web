import { Meal } from './meal';

export interface MealCategory {
  title: string;
  maxMeals: number;
  options: Meal[][];
  isExtra: boolean;
}

export interface MealCategoryWithSelections extends MealCategory {
  selections: Meal[][];
}
