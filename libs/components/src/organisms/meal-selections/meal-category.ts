import { Meal } from './meal';

export interface MealCategory {
  title: string;
  maxMeals: number;
  isExtra: boolean;
  options: Meal[][];
}

export interface MealCategoryWithSelections extends MealCategory {
  selections: Meal[][];
}
