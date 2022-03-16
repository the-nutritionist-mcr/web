import { Recipe, Variant } from '../entities';

export interface ISelectedMeal {
  readonly recipe: Recipe;
  readonly variant: Variant;
}
