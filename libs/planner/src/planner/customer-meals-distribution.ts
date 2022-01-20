import { ICookDay } from '../entities';
import { ImmutableDate } from '../utils';
import { CustomerDistribution } from './customer-distribution';

export class CustomerMealsDistribution {
  public constructor(
    public readonly distributions: ReadonlyArray<CustomerDistribution>,
    public readonly cookDate: ImmutableDate,
    public readonly cookDay: ICookDay
  ) {}
}
