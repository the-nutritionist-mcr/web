import Customer from './Customer';
import { CustomerPlan } from './customer-plan';
import Recipe from './Recipe';
import { StandardPlan } from './standard-plan';

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

export type CustomerWithNewPlan = Omit<
  Customer,
  'plan' | 'snack' | 'breakfast' | 'daysPerWeek'
>;

export type CustomerPlanWithoutConfiguration = Omit<
  CustomerPlan,
  'configuration'
>;

export type CustomerWithChargebeePlan = Omit<CustomerWithNewPlan, 'newPlan'> & {
  newPlan: CustomerPlanWithoutConfiguration;
  chargebeePlan: StandardPlan[];
};

export type CustomerMealsSelection = {
  customer: CustomerWithNewPlan;
  deliveries: Delivery[];
}[];

export type CustomerMealsSelectionWithChargebeeCustomer = {
  customer: CustomerWithChargebeePlan;
  updatedByCustomer?: boolean;
  deliveries: Delivery[];
}[];
