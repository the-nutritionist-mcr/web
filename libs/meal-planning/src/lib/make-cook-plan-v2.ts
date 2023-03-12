import { defaultDeliveryDays } from '@tnmw/config';
import { getRealRecipe } from './get-real-recipe';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { createVariant } from './create-variant';

export interface PlanVariantConfiguration {
  fullName: string;
  planName: string;
  customers: BackendCustomer[];
  count: number;
  recipe: Recipe;
  allergen: boolean;
  customisation: boolean;
}

export interface CookPlanGroup {
  mainRecipe: Recipe;
  primaries: PlanVariantConfiguration[];
  alternates: PlanVariantConfiguration[][];
}

const countPrimaries = (
  deliveryIndex: number,
  plannedRecipe: Recipe,
  selections: MealPlanGeneratedForIndividualCustomer[],
  allRecipes: Recipe[]
) => {
  const selectionsMap = selections.reduce((primaryMap, selection) => {
    const newMap = new Map<string, PlanVariantConfiguration>(primaryMap);
    const delivery = selection.deliveries[deliveryIndex];

    delivery.plans.forEach((plan) => {
      if (plan.status === 'active') {
        plan.meals.forEach((meal) => {
          if (!meal.isExtra && meal.recipe.id === plannedRecipe.id) {
            const realRecipe = getRealRecipe(
              meal.recipe,
              selection.customer,
              allRecipes
            );

            if (realRecipe.id !== meal.recipe.id) {
              return;
            }

            const variant = createVariant(selection.customer, meal, allRecipes);
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
  return Array.from(selectionsMap.values());
};

const countAlternates = (
  deliveryIndex: number,
  plannedRecipe: Recipe,
  selections: MealPlanGeneratedForIndividualCustomer[],
  allRecipes: Recipe[]
) => {
  const selectionsMap = selections.reduce((primaryMap, selection) => {
    const newMap = new Map<string, PlanVariantConfiguration>(primaryMap);
    const delivery = selection.deliveries[deliveryIndex];

    delivery.plans.forEach((plan) => {
      if (plan.status === 'active') {
        plan.meals.forEach((meal) => {
          if (!meal.isExtra && meal.recipe.id === plannedRecipe.id) {
            const realRecipe = getRealRecipe(
              meal.recipe,
              selection.customer,
              allRecipes
            );

            if (realRecipe.id === meal.recipe.id) {
              return;
            }

            const variant = createVariant(
              selection.customer,
              { ...meal, recipe: realRecipe },
              allRecipes
            );

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

  const alternates = Array.from(selectionsMap.values());

  return Array.from(
    alternates
      .reduce((alternatesMap, config) => {
        const newMap = new Map<string, PlanVariantConfiguration[]>(
          alternatesMap
        );
        const value = alternatesMap.get(config.recipe.id) ?? [];
        newMap.set(config.recipe.id, [...value, config]);
        return newMap;
      }, new Map<string, PlanVariantConfiguration[]>())
      .values()
  );
};

const makePlanForDeliveryDay = (
  index: number,
  plannedCook: PlannedCook,
  selections: MealPlanGeneratedForIndividualCustomer[],
  recipes: Recipe[]
): CookPlanGroup[] => {
  return plannedCook.menu.map((plannedRecipe) => {
    const primaries = countPrimaries(index, plannedRecipe, selections, recipes);
    const alternates = countAlternates(
      index,
      plannedRecipe,
      selections,
      recipes
    );

    return {
      mainRecipe: plannedRecipe,
      primaries,
      alternates,
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
