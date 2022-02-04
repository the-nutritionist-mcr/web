import { Customer } from '../entities';
import { ISelectedMeal } from '../meal-selection';
import { PreparedMeal } from './prepared-meal';

export class CustomerDistribution {
  public readonly meals: ReadonlyArray<PreparedMeal>;
  public constructor(
    readonly selectedMeals: ReadonlyArray<ISelectedMeal>,
    public readonly customer: Customer,
    public readonly active: boolean,
    public readonly reason?: string
  ) {
    this.meals = selectedMeals.map((meal) => ({
      customer,
      ...meal,
      tags: customer.tags.filter((tag) => meal.recipe.tags.includes(tag)),
    }));
  }
}
