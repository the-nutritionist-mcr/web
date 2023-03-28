import { BackendCustomer, Recipe } from '@tnmw/types';

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
    customers: BackendCustomer[];
    count: number;
    allergen: boolean;
    customisation: boolean;
    originalName: string;
  };
}

export default CookPlan;
