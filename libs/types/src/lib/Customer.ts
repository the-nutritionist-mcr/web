import Exclusion from './Exclusion';
import Plan from './Plan';
import { CustomerPlan } from './customer-plan';

export enum Snack {
  None = 'None',
  Standard = 'Standard',
  Large = 'Large',
}

export default interface CustomerWithChargebeePlan {
  id: string;
  firstName: string;
  surname: string;
  createdAt?: string;
  updatedAt?: string;
  salutation: string;
  address: string;
  telephone: string;
  startDate?: string;
  paymentDayOfMonth?: number;
  notes?: string;
  email: string;
  pauseStart?: string;
  pauseEnd?: string;

  /**
   * @deprecated
   */
  daysPerWeek: number;

  /**
   * @deprecated
   */
  plan: Plan;
  newPlan?: CustomerPlan;

  /**
   * @deprecated
   */
  legacyPrice?: number;

  /**
   * @deprecated
   */
  snack: Snack;

  /**
   * @deprecated
   */
  breakfast: boolean;
  exclusions: Exclusion[];
}
