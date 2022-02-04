import { ICustomerActivator } from '../meal-selection/i-customer-activator';
import { IMealSelector } from '../meal-selection/i-meal-selector';
import { Customer } from '../entities/customer';
import { CustomerDistribution } from './customer-distribution';
import { CustomerMealsDistribution } from './customer-meals-distribution';
import { Recipe } from '../entities/recipe';
import { ImmutableDate } from '../utils/immutable-date';
import { ICookDay } from '../entities';
import { ISelectedMeal } from '../meal-selection';

export interface ICustomerDistributionFactory {
  getCustomerDistribution(
    selectedMeals: ReadonlyArray<ISelectedMeal>,
    customer: Customer,
    active: boolean,
    reason?: string
  ): CustomerDistribution;

  getCustomerMealsDistribution(
    distributions: ReadonlyArray<CustomerDistribution>,
    cookDate: ImmutableDate,
    cookDay: ICookDay
  ): CustomerMealsDistribution;
}

export class MealsToCook {
  public constructor(
    private cookDate: ImmutableDate,
    private recipes: ReadonlyArray<Recipe>,
    private customers: ReadonlyArray<Customer>,
    private distributionFactory: ICustomerDistributionFactory,
    private cookDay: ICookDay
  ) {}

  public distribute(
    activator: ICustomerActivator,
    generator: IMealSelector
  ): CustomerMealsDistribution {
    const distributions = this.customers.map((customer) => {
      const meals = generator.selectMeals(this.cookDay, this.recipes, customer);

      const activeResponse = activator.active(
        customer,
        this.cookDay,
        this.cookDate
      );

      return this.distributionFactory.getCustomerDistribution(
        meals,
        customer,
        activeResponse.active,
        activeResponse.reason
      );
    });

    return this.distributionFactory.getCustomerMealsDistribution(
      distributions,
      this.cookDate,
      this.cookDay
    );
  }
}
