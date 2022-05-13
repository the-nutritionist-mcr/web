import { Delivery } from './customer-plan';
import Exclusion from './Exclusion';

export interface UpdateCustomerBody {
  customPlan?: Delivery[];
  customisations: Exclusion[];
}

export const isUpdateCustomerBody = (
  thing: unknown
): thing is UpdateCustomerBody => {
  const thingAs = thing as UpdateCustomerBody;

  return (
    (typeof thingAs.customPlan === 'undefined' ||
      Array.isArray(thingAs.customPlan)) &&
    Array.isArray(thingAs.customisations)
  );
};
