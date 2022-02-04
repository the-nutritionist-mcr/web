import Customer from '../domain/Customer';
import Recipe from '../domain/Recipe';

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
  };
}

export default CookPlan;
