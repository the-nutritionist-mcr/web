import { BackendCustomer } from './backend-customer';
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
    customers: BackendCustomer[];
    count: number;
    allergen: boolean;
    customisation: boolean;
  };
}

export default CookPlan;
