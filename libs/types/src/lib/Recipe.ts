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

  return (
    typeof asRecipe.id === 'string' &&
    typeof asRecipe.name === 'string' &&
    typeof asRecipe.shortName === 'string' &&
    typeof asRecipe.hotOrCold === 'string' &&
    (!asRecipe.description || typeof asRecipe.description === 'string') &&
    (!asRecipe.allergens || typeof asRecipe.allergens === 'string') &&
    Array.isArray(asRecipe.potentialExclusions) &&
    asRecipe.potentialExclusions.every((item) => isExclusion(item)) &&
    (!asRecipe.invalidExclusions ||
      (Array.isArray(asRecipe.invalidExclusions) &&
        asRecipe.invalidExclusions.every(
          (item) => typeof item === 'string'
        ))) &&
    (!asRecipe.createdAt || typeof asRecipe.createdAt === 'string') &&
    (!asRecipe.updatedAt || typeof asRecipe.updatedAt === 'string')
  );
};
