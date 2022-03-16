import { Customer, Recipe, Tag, Variant } from '../entities';

export interface PreparedMeal {
  readonly customer: Customer;
  readonly recipe: Omit<Recipe, 'tags' | 'variants'>;
  readonly variant: Variant;
  readonly tags: ReadonlyArray<Tag>;
}
