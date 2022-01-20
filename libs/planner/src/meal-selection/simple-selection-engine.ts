import { Customer, ICookDay, Recipe } from "@/entities";
import { IMealSelector } from "./i-meal-selector";

export class SimpleDistributionEngine implements IMealSelector {
  public selectMeals(
    cookDay: ICookDay,
    recipes: ReadonlyArray<Recipe>,
    customer: Customer
  ) {
    const delivery = customer.plan.deliveries.find(
      delivery => delivery.cookDay === cookDay
    );

    if (!delivery) {
      throw new Error("No delivery found!");
    }

    const startingPoint = delivery.meals.flatMap(meal =>
      [...new Array(meal.quantity)].map(() => meal.variant)
    );

    return startingPoint.map((variant, index) => ({
      recipe: SimpleDistributionEngine.pickRecipe(recipes, index),
      variant
    }));
  }

  private static pickRecipe(recipes: ReadonlyArray<Recipe>, index: number) {
    const recipe = recipes[index % recipes.length];

    if (!recipe) {
      throw new Error("Something went wrong");
    }

    return recipe;
  }
}
