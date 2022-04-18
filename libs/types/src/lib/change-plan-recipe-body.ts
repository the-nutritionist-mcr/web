import { PlanLabels } from './customer-plan';
import Recipe, { isRecipe } from './Recipe';

export interface ChangePlanRecipeBody {
  recipe: Recipe;
  selectionId: string;
  selectionSort: string;
  deliveryIndex: number;
  itemIndex: number;
  chosenVariant: PlanLabels;
}

export const isChangePlanRecipeBody = (
  body: unknown
): body is ChangePlanRecipeBody => {
  const bodyAsAny = body as any;

  if (!isRecipe(bodyAsAny.recipe)) {
    return false;
  }

  if (typeof bodyAsAny.selectionId !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.deliveryIndex !== 'number') {
    return false;
  }

  if (typeof bodyAsAny.itemIndex !== 'number') {
    return false;
  }

  if (typeof bodyAsAny.chosenVariant !== 'string') {
    return false;
  }

  return true;
};
