import { useResource } from './use-resource';
import { Exclusion, Recipe } from '@tnmw/admin-app';
export { usePlan } from './use-plans';

export const useCustomisations = () => useResource<Exclusion>('customisation');

export const useRecipes = (ids?: string[] | string) => {
  const result = useResource<Recipe>('recipe', ids);

  return {
    ...result,
    items: result.items?.map<Recipe>((item) => {
      const recipeWithExtraField = item as Recipe & {
        vegeterianOption: string | null;
      };
      const { vegetarianOption, ...rest } = recipeWithExtraField;
      return rest;
    }),
  };
};

export { useAuthorisation } from './use-authorisation';
