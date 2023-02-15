import { useResource } from './use-resource';
import { Exclusion, Recipe } from '@tnmw/types';
export { usePlan } from './use-plans';

export const useCustomisations = (page?: number) =>
  useResource<Exclusion>({ type: 'customisation', page });

export const useRecipes = <P extends readonly (keyof Recipe)[]>(
  ids?: string[] | string,
  projection?: P
) => {
  const result = useResource<Recipe, P>({
    type: 'recipe',
    idsOrSearchTerm: ids,
    projection,
  });

  return {
    ...result,
    items: result.items?.map((item) => {
      const recipeWithExtraField = item as typeof item & {
        vegetarianOption: string | null;
      };
      const { vegetarianOption, ...rest } = recipeWithExtraField;
      return rest;
    }),
  };
};

export { useAuthorisation } from './use-authorisation';
