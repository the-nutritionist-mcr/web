import Exclusion, { isExclusion } from './Exclusion';

export enum HotOrCold {
  Hot = 'Hot',
  Cold = 'Cold',
  Both = 'Both',
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
  createdAt?: string;
  updatedAt?: string;
}

export const isRecipe = (recipe: unknown): recipe is Recipe => {
  if (typeof recipe !== 'object') {
    return false;
  }

  const asRecipe = recipe as Recipe;

  if (typeof asRecipe.id !== 'string') {
    return false;
  }

  if (typeof asRecipe.name !== 'string') {
    return false;
  }

  if (typeof asRecipe.shortName !== 'string') {
    return false;
  }

  if (typeof asRecipe.hotOrCold !== 'string') {
    return false;
  }

  if (
    !Array.isArray(asRecipe.invalidExclusions) ||
    !asRecipe.invalidExclusions.every((item) => typeof item === 'string')
  ) {
    return false;
  }

  if (asRecipe.description && typeof asRecipe.description !== 'string') {
    return false;
  }

  if (asRecipe.allergens && typeof asRecipe.allergens !== 'string') {
    return false;
  }

  if (
    !Array.isArray(asRecipe.potentialExclusions) ||
    !asRecipe.potentialExclusions.every((item) => isExclusion(item))
  ) {
    return false;
  }

  if (
    asRecipe.invalidExclusions &&
    (!Array.isArray(asRecipe.invalidExclusions) ||
      !asRecipe.invalidExclusions.every((item) => typeof item === 'string'))
  ) {
    return false;
  }

  if (asRecipe.createdAt && typeof asRecipe.createdAt !== 'string') {
    return false;
  }

  if (asRecipe.updatedAt && typeof asRecipe.createdAt !== 'string') {
    return false;
  }

  return true;
};
