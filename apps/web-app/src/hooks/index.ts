import { useResource } from './use-resource';
import { Exclusion, Recipe } from '@tnmw/admin-app';

export const useCustomisations = () => useResource<Exclusion>('customisation');

export const useRecipes = () => useResource<Recipe>('recipe');

interface Me {
  id: string;
  first_name: string;
}

export const useMe = () => useResource<Me>('customers/me');
