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
    console.log('one');
    return false;
  }

  if (typeof asRecipe.name !== 'string') {
    console.log('two');
    return false;
  }

  if (typeof asRecipe.shortName !== 'string') {
    console.log('three');
    return false;
  }

  if (typeof asRecipe.hotOrCold !== 'string') {
    console.log('four');
    return false;
  }

  if (
    !Array.isArray(asRecipe.invalidExclusions) ||
    !asRecipe.invalidExclusions.every((item) => typeof item === 'string')
  ) {
    console.log('five');
    return false;
  }

  if (asRecipe.description && typeof asRecipe.description !== 'string') {
    console.log('six');
    return false;
  }

  if (asRecipe.allergens && typeof asRecipe.allergens !== 'string') {
    console.log('seven');
    return false;
  }

  if (
    !Array.isArray(asRecipe.potentialExclusions) ||
    !asRecipe.potentialExclusions.every((item) => isExclusion(item))
  ) {
    console.log('eight');
    return false;
  }

  if (
    asRecipe.invalidExclusions &&
    (!Array.isArray(asRecipe.invalidExclusions) ||
      !asRecipe.invalidExclusions.every((item) => typeof item === 'string'))
  ) {
    console.log('nine');
    return false;
  }

  if (asRecipe.createdAt && typeof asRecipe.createdAt !== 'string') {
    console.log('ten');
    return false;
  }

  if (asRecipe.updatedAt && typeof asRecipe.createdAt !== 'string') {
    console.log('eleven');
    return false;
  }

  return true;
};
