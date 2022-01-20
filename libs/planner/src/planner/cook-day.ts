import { MealsToCook } from './meals-to-cook';

import { DaysOfWeek } from '../types';
import { ImmutableDate } from '../utils/immutable-date';
import { Customer, ICookDay, Recipe } from '../entities';
import { CustomerDistributionFactory } from './customer-distribution-factory';

interface CookDayConfig {
  readonly dayOfWeek: DaysOfWeek;
  readonly eatingDaysCovered: ReadonlyArray<DaysOfWeek>;
}

export class CookDay implements ICookDay {
  constructor(private readonly config: CookDayConfig) {}

  get dayOfWeek(): DaysOfWeek {
    return this.config.dayOfWeek;
  }

  get eatingDaysCovered() {
    return this.config.eatingDaysCovered;
  }

  public getMealSelection(
    date: ImmutableDate,
    recipes: ReadonlyArray<Recipe>,
    customers: ReadonlyArray<Customer>
  ) {
    return new MealsToCook(
      date,
      recipes,
      customers,
      new CustomerDistributionFactory(),
      this
    );
  }
}
