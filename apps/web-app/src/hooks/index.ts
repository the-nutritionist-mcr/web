import { useResource } from './use-resource';
import { Exclusion, Recipe } from '@tnmw/admin-app';

export const useCustomisations = () => useResource<Exclusion>('customisation');

export const useRecipes = () => useResource<Recipe>('recipe')
