import { DeliveryItem, Recipe } from '@tnmw/types';

type Counts = {
  [key: string]: number;
};

export const planFromCounts = (
  counts: Counts,
  recipes: Recipe[],
  chosenVariant: string
): DeliveryItem[] =>
  Object.entries(counts)
    .flatMap(([id, count]) => {
      return Array.from({ length: count }, () =>
        recipes.find((recipe) => recipe.id === id)
      );
    })
    .flatMap((recipe) =>
      recipe ? [{ recipe, isExtra: false, chosenVariant }] : []
    );
