import { Customer, CustomerWithChargebeePlan, Recipe } from '@tnmw/types';

export interface SelectedMeal {
  recipe: Recipe;
  chosenVariant: string;
}

export const isSelectedMeal = (
  selectedItem: SelectedItem
): selectedItem is SelectedMeal =>
  Boolean((selectedItem as SelectedMeal).recipe);

export interface SelectedExtra {
  chosenVariant: string;
}

export type SelectedItem = SelectedMeal | SelectedExtra;

export type Delivery = SelectedItem[] | string;

type CustomerWithNewPlan = Omit<
  Customer,
  'plan' | 'snack' | 'breakfast' | 'daysPerWeek'
>;

export type CustomerMealsSelection = {
  customer: CustomerWithChargebeePlan;
  deliveries: Delivery[];
}[];
