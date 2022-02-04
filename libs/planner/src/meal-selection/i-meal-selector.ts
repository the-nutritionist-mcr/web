import { Customer, ICookDay, Recipe } from '@/entities';
import { ISelectedMeal } from './i-selected-meal';

export interface IMealSelector {
  selectMeals: (
    cookDay: ICookDay,
    recipes: ReadonlyArray<Recipe>,
    customer: Customer
  ) => ReadonlyArray<ISelectedMeal>;
}
