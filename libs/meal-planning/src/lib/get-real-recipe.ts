import { Customer, Recipe } from '@tnmw/types';

interface Meal {
  id: string;
  alternates?: { customisationId: string; recipeId: string }[];
  name?: string;
  description?: string;
}

export const getRealRecipe = (
  recipe: Meal,
  customer: Customer,
  recipes: Meal[]
) => {
  const alternates = recipe.alternates ?? [];

  if (alternates.length === 0) {
    return recipe;
  }

  const alternate = alternates.find((alternate) =>
    customer.exclusions
      .map((exclusion) => exclusion.id)
      .includes(alternate.customisationId)
  );

  return (
    (alternate
      ? recipes.find((recipe) => alternate.recipeId === recipe.id)
      : recipe) ?? recipe
  );
};
