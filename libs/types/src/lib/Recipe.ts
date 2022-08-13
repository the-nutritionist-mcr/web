import Exclusion, { isExclusion } from './Exclusion';

export enum HotOrCold {
  Hot = 'Hot',
  Cold = 'Cold',
  Both = 'Both',
}

export interface Alternate {
  customisationId: string;
  recipeId: string;
}

export default interface Recipe {
  id: string;
  name: string;
  shortName: string;
  hotOrCold: HotOrCold;
  description?: string;
  allergens?: string;
  potentialExclusions: Exclusion[];
  invalidExclusions?: string[];
  alternates?: Alternate[];
  createdAt?: string;
  updatedAt?: string;
}

export const assertIsRecipe: (recipe: unknown) => asserts recipe is Recipe = (
  recipe
) => {
  if (typeof recipe !== 'object') {
    throw new TypeError('Recipe is not object');
  }

  const asRecipe = recipe as Recipe;

  if (typeof asRecipe.id !== 'string') {
    throw new TypeError('Recipe.id is not a string');
  }

  if (typeof asRecipe.name !== 'string') {
    throw new TypeError('Recipe.name is not a string');
  }

  if (typeof asRecipe.shortName !== 'string') {
    throw new TypeError('Recipe.shortName is not a string');
  }

  if (typeof asRecipe.hotOrCold !== 'string') {
    throw new TypeError('Recipe.hotOrCold is not a string');
  }

  if (
    (asRecipe.alternates && !Array.isArray(asRecipe.alternates)) ||
    !asRecipe.alternates?.every(
      (item) =>
        typeof item.recipeId === 'string' &&
        typeof item.customisationId === 'string'
    )
  ) {
    throw new TypeError('Recipe.alternates are invalid');
  }

  if (
    !Array.isArray(asRecipe.invalidExclusions) ||
    !asRecipe.invalidExclusions.every((item) => typeof item === 'string')
  ) {
    throw new TypeError('Recipe.invalidExclusions are invalid');
  }

  if (asRecipe.description && typeof asRecipe.description !== 'string') {
    throw new TypeError('Recipe.description is not a string');
  }

  if (asRecipe.allergens && typeof asRecipe.allergens !== 'string') {
    throw new TypeError('Recipe.allergens is not a string');
  }

  if (
    !Array.isArray(asRecipe.potentialExclusions) ||
    !asRecipe.potentialExclusions.every((item) => isExclusion(item))
  ) {
    throw new TypeError('Recipe.potentialExclusions are not valid');
  }

  if (
    asRecipe.invalidExclusions &&
    (!Array.isArray(asRecipe.invalidExclusions) ||
      !asRecipe.invalidExclusions.every((item) => typeof item === 'string'))
  ) {
    throw new TypeError('Recipe.invalidExclusions are not valid');
  }

  if (asRecipe.createdAt && typeof asRecipe.createdAt !== 'string') {
    throw new TypeError('Recipe.createdAt is not a string');
  }

  if (asRecipe.updatedAt && typeof asRecipe.createdAt !== 'string') {
    throw new TypeError('Recipe.updatedAt is not a string');
  }
};
