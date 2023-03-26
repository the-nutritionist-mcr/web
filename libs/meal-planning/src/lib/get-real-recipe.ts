import {
  BackendCustomer,
  DeliveryMeal,
  MealPlanGeneratedForIndividualCustomer,
  SwappedMealPlan,
  Recipe,
} from '@tnmw/types';

const findAlternate = (
  recipe: Recipe,
  customer: { customisations?: BackendCustomer['customisations'] },
  recipes: Recipe[]
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

export const getRealRecipeHelper = (
  recipe: Recipe,
  customer: BackendCustomer,
  recipes: Recipe[],
  recipeIds?: Set<string>
): Recipe => {
  const ids = recipeIds ?? new Set<string>();
  if (ids.has(recipe.id ?? '')) {
    throw new Error('Cyclic reference in alternate chain');
  } else {
    ids.add(recipe.id ?? '');
  }
  const alternate = findAlternate(recipe, customer, recipes);

  if (findAlternate(alternate, customer, recipes) === alternate) {
    return alternate;
  }

  return getRealRecipeHelper(alternate, customer, recipes, ids);
};

export const getRealRecipe = (
  recipe: Recipe,
  customer: BackendCustomer,
  recipes: Recipe[]
): Recipe & { originalName: string } => {
  const liveRecipe =
    recipes.find((needle) => needle.id === recipe.id) ?? recipe;

  return {
    ...getRealRecipeHelper(liveRecipe, customer, recipes),
    originalName: recipe.name,
  };
};

const isSelectedMeal = (item: unknown): item is DeliveryMeal => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemAsAny = item as any;

  return !itemAsAny.isExtra;
};

export const performSwaps = (
  plan: MealPlanGeneratedForIndividualCustomer,
  customer: BackendCustomer,
  recipes: Recipe[]
): SwappedMealPlan => {
  return {
    ...plan,
    deliveries: plan.deliveries.map((delivery) => {
      const newDelivery = delivery.paused
        ? { ...delivery }
        : {
            ...delivery,
            plans: delivery.plans.map((plan) =>
              plan.status === 'active'
                ? {
                    ...plan,
                    meals: plan.meals.map((meal) =>
                      isSelectedMeal(meal)
                        ? {
                            ...meal,
                            recipe: getRealRecipe(
                              meal.recipe,
                              customer,
                              recipes
                            ),
                          }
                        : meal
                    ),
                  }
                : plan
            ),
          };
      return newDelivery;
    }),
  };
};
