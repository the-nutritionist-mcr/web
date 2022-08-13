import { BackendCustomer, Customer } from '@tnmw/types';

interface Meal {
  id: string;
  alternates?: { customisationId: string; recipeId: string }[];
  name?: string;
  description?: string;
}

export const getRealRecipe = (
  recipe: Meal,
  customer: { customisations?: BackendCustomer['customisations'] },
  recipes: Meal[]
) => {
  const alternates = recipe.alternates ?? [];

  if (alternates.length === 0) {
    return recipe;
  }

  const exclusions = customer.customisations ?? [];

  const alternate = alternates.find((alternate) =>
    exclusions
      .map((exclusion) => exclusion.id)
      .includes(alternate.customisationId)
  );

  return (
    (alternate
      ? recipes.find((recipe) => alternate.recipeId === recipe.id)
      : recipe) ?? recipe
  );
};
