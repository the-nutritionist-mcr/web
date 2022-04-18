import { CustomerWithChargebeePlan } from '..';
import Recipe from './Recipe';

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
    customers: CustomerWithChargebeePlan[];
    count: number;
    allergen: boolean;
    customisation: boolean;
  };
}

export default CookPlan;
