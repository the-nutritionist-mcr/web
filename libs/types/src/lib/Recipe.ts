import Exclusion, { isExclusion } from './Exclusion';

export enum HotOrCold {
  Hot = 'Hot',
  Cold = 'Cold',
  Both = 'Both',
}

interface Alternate {
  alternateId: string;
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
    throw new Error('Recipe is not object');
  }

  const asRecipe = recipe as Recipe;

  if (typeof asRecipe.id !== 'string') {
    throw new Error('Recipe.id is not a string');
  }

  if (typeof asRecipe.name !== 'string') {
    throw new Error('Recipe.name is not a string');
  }

  if (typeof asRecipe.shortName !== 'string') {
    throw new Error('Recipe.shortName is not a string');
  }

  if (typeof asRecipe.hotOrCold !== 'string') {
    throw new Error('Recipe.hotOrCold is not a string');
  }

  if (
    (asRecipe.alternates && !Array.isArray(asRecipe.alternates)) ||
    !asRecipe.alternates?.every(
      (item) =>
        typeof item.recipeId === 'string' &&
        typeof item.alternateId === 'string'
    )
  ) {
    throw new Error('Recipe.alternates are invalid');
  }

  if (
    !Array.isArray(asRecipe.invalidExclusions) ||
    !asRecipe.invalidExclusions.every((item) => typeof item === 'string')
  ) {
    throw new Error('Recipe.invalidExclusions are invalid');
  }

  if (asRecipe.description && typeof asRecipe.description !== 'string') {
    throw new Error('Recipe.description is not a string');
  }

  if (asRecipe.allergens && typeof asRecipe.allergens !== 'string') {
    throw new Error('Recipe.allergens is not a string');
  }

  if (
    !Array.isArray(asRecipe.potentialExclusions) ||
    !asRecipe.potentialExclusions.every((item) => isExclusion(item))
  ) {
    throw new Error('Recipe.potentialExclusions are not valid');
  }

  if (
    asRecipe.invalidExclusions &&
    (!Array.isArray(asRecipe.invalidExclusions) ||
      !asRecipe.invalidExclusions.every((item) => typeof item === 'string'))
  ) {
    throw new Error('Recipe.invalidExclusions are not valid');
  }

  if (asRecipe.createdAt && typeof asRecipe.createdAt !== 'string') {
    throw new Error('Recipe.createdAt is not a string');
  }

  if (asRecipe.updatedAt && typeof asRecipe.createdAt !== 'string') {
    throw new Error('Recipe.updatedAt is not a string');
  }
};
