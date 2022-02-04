import { Tag } from './tag';
import { Variant } from './variant';

export interface Recipe {
  readonly id: string;
  readonly name: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly variants: ReadonlyArray<Variant>;
}
