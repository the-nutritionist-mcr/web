import { defaultDeliveryDays } from '@tnmw/config';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { createVariant } from './create-variant';

interface PlanVariantConfiguration {
  fullName: string;
  planName: string;
  customers: BackendCustomer[];
  count: number;
  recipe: Recipe;
  allergen: boolean;
  customisation: boolean;
}

interface CookPlanGroup {
  mainRecipe: Recipe;
  primaries: PlanVariantConfiguration[];
  alternates: PlanVariantConfiguration[][];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const makePlanForDeliveryDay = (
  index: number,
  plannedCook: PlannedCook,
  selections: MealPlanGeneratedForIndividualCustomer[],
  recipes: Recipe[]
): CookPlanGroup[] => {
  return plannedCook.menu.map((plannedRecipe) => {
    const primaries = selections.reduce((primaryMap, selection) => {
      const newMap = new Map<string, PlanVariantConfiguration>(primaryMap);
      const delivery = selection.deliveries[index];
      delivery.plans.forEach((plan) => {
        if (plan.status === 'active') {
          plan.meals.forEach((meal) => {
            if (!meal.isExtra && meal.recipe.id === plannedRecipe.id) {
              const variant = createVariant(selection.customer, meal, recipes);
              const previous = primaryMap.get(variant.string);
              newMap.set(variant.string, {
                fullName: variant.string,
                planName: plan.name,
                customers: [...(previous?.customers ?? [])],
                count: (previous?.count ?? 0) + 1,
                recipe: meal.recipe,
                allergen: variant.allergen,
                customisation: variant.customisation,
              });
            }
          });
        }
      });
      return newMap;
    }, new Map<string, PlanVariantConfiguration>());
    return {
      mainRecipe: plannedRecipe,
      primaries: Array.from(primaries.values()),
      alternates: [],
    };
  });
};

export const makeCookPlan = (
  selections: MealPlanGeneratedForIndividualCustomer[],
  allMeals: Recipe[],
  plannedCooks: PlannedCook[]
): CookPlanGroup[][] => {
  return defaultDeliveryDays.map((_, index) =>
    makePlanForDeliveryDay(index, plannedCooks[index], selections, allMeals)
  );
};
