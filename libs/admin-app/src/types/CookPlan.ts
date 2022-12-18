import { Recipe } from '@tnmw/types';
import { Customer } from '..';

type CookPlan = {
  recipe: Recipe | string;
  plan: {
    [variant: string]: {
      count: number;
      allergen: boolean;
      customisation: boolean;
    };
  };
}[];

export interface RecipeVariantMap {
  [variantName: string]: {
    customers: Customer[];
    count: number;
    allergen: boolean;
    customisation: boolean;
    originalName: string;
  };
}

export default CookPlan;
