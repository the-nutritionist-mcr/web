import { CustomerMealPlan } from './customer-meal-plan';
import { Tag } from './tag';

export interface Customer {
  readonly id: string;
  readonly firstname: string;
  readonly surname: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly pauseStart: Date;
  readonly pauseEnd: Date;
  readonly plan: CustomerMealPlan;
}
