import { useResource } from './use-resource';
import { Exclusion, Recipe } from '@tnmw/admin-app';
export { usePlan } from './use-plans';

export const useCustomisations = () => useResource<Exclusion>('customisation');

export const useRecipes = () => useResource<Recipe>('recipe');
