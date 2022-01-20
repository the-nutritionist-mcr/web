import { Customer, ICookDay } from '../entities';
import { ISelectedMeal } from '../meal-selection';
import { ImmutableDate } from '../utils';
import { CustomerDistribution } from './customer-distribution';
import { CustomerMealsDistribution } from './customer-meals-distribution';
import { ICustomerDistributionFactory } from './meals-to-cook';

export class CustomerDistributionFactory
  implements ICustomerDistributionFactory
{
  getCustomerMealsDistribution(
    distributions: ReadonlyArray<CustomerDistribution>,
    cookDate: ImmutableDate,
    cookDay: ICookDay
  ): CustomerMealsDistribution {
    return new CustomerMealsDistribution(distributions, cookDate, cookDay);
  }
  getCustomerDistribution(
    selectedMeals: ReadonlyArray<ISelectedMeal>,
    customer: Customer,
    active: boolean,
    reason?: string
  ): CustomerDistribution {
    return new CustomerDistribution(selectedMeals, customer, active, reason);
  }
}
