import { SelectedItem } from './customer-meal-selection';

export interface SubmitCustomerOrderPayload {
  deliveries: SelectedItem[][];
  plan: string;
  sort: string;
}

export const isSubmitCustomerOrderPayload = (
  body: unknown
): body is SubmitCustomerOrderPayload => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyAsAny = body as any;

  if (typeof bodyAsAny.plan !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.sort !== 'string') {
    return false;
  }

  return true;
};
