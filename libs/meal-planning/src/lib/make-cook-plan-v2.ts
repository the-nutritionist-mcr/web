import { defaultDeliveryDays } from '@tnmw/config';
import { getRealRecipe } from './get-real-recipe';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { createVariant } from './create-variant';

export interface PlanExtraConfiguration {
  fullName: string;
  customers: BackendCustomer[];
  count: number;
}

export interface PlanVariantConfiguration {
  fullName: string;
  planName: string;
  customers: BackendCustomer[];
  count: number;
  recipe: Recipe;
  allergen: boolean;
  customisation: boolean;
}

export interface NewCookPlan {
  plan: (CookPlanGroup | ExtraCount)[];
  date: Date;
}

export interface ExtraCount {
  isExtra: true;
  name: string;
  customers: BackendCustomer[];
  count: number;
}

export interface CookPlanGroup {
  isExtra: false;
  mainRecipe: Recipe;
  primaries: PlanVariantConfiguration[];
  alternates: PlanVariantConfiguration[][];
}

const countExtras = (
  deliveryIndex: number,
  selections: MealPlanGeneratedForIndividualCustomer[]
) => {
  const extrasMap = selections.reduce((primaryMap, selection) => {
    const delivery = selection.deliveries[deliveryIndex];
    if (delivery.paused) {
      return primaryMap;
    }
    const newMap = new Map<string, ExtraCount>(primaryMap);

    delivery.plans.forEach((plan) => {
      if (plan.status === 'active') {
        plan.meals.forEach((meal) => {
          if (meal.isExtra) {
            const previous = newMap.get(meal.extraName);

            newMap.set(meal.extraName, {
              isExtra: true,
              name: meal.extraName,
              count: (previous?.count ?? 0) + 1,
              customers: [...(previous?.customers ?? []), selection.customer],
            });
          }
        });
      }
    });
    return newMap;
  }, new Map<string, ExtraCount>());
  return Array.from(extrasMap.values());
};

const countPrimaries = (
  deliveryIndex: number,
  plannedRecipe: Recipe,
  selections: MealPlanGeneratedForIndividualCustomer[],
  allRecipes: Recipe[]
) => {
  const selectionsMap = selections.reduce((primaryMap, selection) => {
    const delivery = selection.deliveries[deliveryIndex];
    if (delivery.paused) {
      return primaryMap;
    }
    const newMap = new Map<string, PlanVariantConfiguration>(primaryMap);

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
            const previous = newMap.get(variant.string);
            newMap.set(variant.string, {
              fullName: variant.string,
              planName: plan.name,
              customers: [...(previous?.customers ?? []), selection.customer],
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
    const delivery = selection.deliveries[deliveryIndex];
    if (delivery.paused) {
      return primaryMap;
    }
    const newMap: Map<string, PlanVariantConfiguration> = new Map<
      string,
      PlanVariantConfiguration
    >(primaryMap);

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

            const previous = newMap.get(variant.string);
            newMap.set(variant.string, {
              fullName: variant.string,
              planName: plan.name,
              customers: [...(previous?.customers ?? []), selection.customer],
              count: (previous?.count ?? 0) + 1,
              recipe: realRecipe,
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
      isExtra: false,
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
): NewCookPlan[] => {
  return defaultDeliveryDays.map((_, index) => ({
    date: plannedCooks[index].date,
    plan: [
      ...makePlanForDeliveryDay(
        index,
        plannedCooks[index],
        selections,
        allMeals
      ),
      ...countExtras(index, selections),
    ],
  }));
};
