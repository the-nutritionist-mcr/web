import { BackendCustomer, Customer } from '@tnmw/types';

interface Meal {
  id?: string;
  alternates?: { customisationId: string; recipeId: string }[];
  name?: string;
  description?: string;
}

const findAlternate = (
  recipe: Meal,
  customer: { customisations?: BackendCustomer['customisations'] },
  recipes: Meal[]
) => {
  const exclusions = customer.customisations ?? [];
  const alternates = recipe?.alternates ?? [];

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

export const getRealRecipe = (
  recipe: Meal,
  customer: { customisations?: BackendCustomer['customisations'] },
  recipes: Meal[],
  recipeIds?: Set<string>
): Meal => {
  const ids = recipeIds ?? new Set<string>();
  if (ids.has(recipe.id ?? '')) {
    throw new Error();
  } else {
    ids.add(recipe.id ?? '');
  }
  const alternate = findAlternate(recipe, customer, recipes);

  if (findAlternate(alternate, customer, recipes) === alternate) {
    return alternate;
  }

  return getRealRecipe(alternate, customer, recipes, ids);
};
