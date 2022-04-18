import Recipe from './Recipe';

export interface ChangePlanRecipeBody {
  recipe: Recipe;
  selectionId: string;
  selectionSort: string;
  deliveryIndex: number;
  itemIndex: number;
}
