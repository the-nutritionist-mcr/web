import { PlanLabels } from './customer-plan';
import Recipe, { assertIsRecipe } from './Recipe';

export interface ChangePlanRecipeBody {
  recipe?: Recipe;
  selectionId: string;
  selectionSort: string;
  deliveryIndex: number;
  itemIndex?: number;
  chosenVariant?: PlanLabels;
}

export const isChangePlanRecipeBody = (
  body: unknown
): body is ChangePlanRecipeBody => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyAsAny = body as any;

  if (typeof bodyAsAny.recipe !== 'undefined') {
    assertIsRecipe(bodyAsAny.recipe);
  }

  if (typeof bodyAsAny.selectionId !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.deliveryIndex !== 'number') {
    return false;
  }

  if (
    typeof bodyAsAny.itemIndex !== 'undefined' &&
    typeof bodyAsAny.itemIndex !== 'number'
  ) {
    return false;
  }

  if (
    typeof bodyAsAny.chosenVariant !== 'undefined' &&
    typeof bodyAsAny.chosenVariant !== 'string'
  ) {
    return false;
  }

  return true;
};
