import { SelectedItem, SelectedMeal } from './customer-meal-selection';

export interface SubmitCustomerOrderPayload {
  deliveries: SelectedItem[][];
  plan: string;
  sort: string;
}

export const isSubmitCustomerOrderPayload = (
  body: unknown
): body is SubmitCustomerOrderPayload => {
  const bodyAsAny = body as any;

  if (typeof bodyAsAny.plan !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.sort !== 'string') {
    return false;
  }

  return true;
};
