import Customer from './Customer';
import { SelectedMeal } from './customer-meal-selection';
import Recipe, { isRecipe } from './Recipe';

export interface SubmitCustomerOrderPayload {
  deliveries: SelectedMeal[][];
  plan: string;
  sort: string;
  customer: Customer;
}

export const isSubmitCustomerOrderPayload = (
  body: unknown
): body is SubmitCustomerOrderPayload => {
  const bodyAsAny = body as any;

  if (
    typeof bodyAsAny.deliveries !== 'undefined' &&
    !Array.isArray(bodyAsAny.deliveries) &&
    !bodyAsAny.deliveries.every(
      (delivery: Recipe[]) =>
        Array.isArray(delivery) && delivery.every((meal) => isRecipe(meal))
    )
  ) {
    return false;
  }

  if (typeof bodyAsAny.plan !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.customer === 'undefined') {
    return false;
  }

  if (typeof bodyAsAny.sort !== 'string') {
    return false;
  }

  return true;
};
