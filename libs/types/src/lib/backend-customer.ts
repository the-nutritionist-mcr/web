import { Delivery } from './customer-plan';
import Exclusion from './Exclusion';
import type { StandardPlan } from './standard-plan';

export interface BackendCustomer {
  groups: string[];
  username: string;
  country: string;
  numberOfBags: number;
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  customerUpdateTime: string;
  deliveryNotes?: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  addressLine3: string;
  subscriptionUpdateTime: string;
  firstName: string;
  surname: string;
  salutation: string;
  email: string;
  city: string;
  postcode: string;
  plans: StandardPlan[];
  customisations: Exclusion[];
  customPlan?: Delivery[];
}
