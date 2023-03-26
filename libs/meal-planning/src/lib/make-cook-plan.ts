import { createVariant } from './create-variant';
import { defaultDeliveryDays } from '@tnmw/config';
import {
  BackendCustomer,
  DeliveryItem,
  DeliveryMeal,
  MealPlanGeneratedForIndividualCustomer,
  Recipe,
  RecipeVariantMap,
  Swapped,
} from '@tnmw/types';

const isSelectedMeal = (item: unknown): item is DeliveryMeal => {
  const itemAsAny = item as any;

  return !itemAsAny.isExtra;
};

const updateVariantMap = (
  map: Map<string, RecipeVariantMap>,
  customer: BackendCustomer,
  item: Swapped<DeliveryItem>,
  allMeals: Recipe[]
) => {
  const variant = createVariant(customer, item, allMeals);
  const key = isSelectedMeal(item) ? item.recipe.name : item.extraName;

  const originalName = isSelectedMeal(item)
    ? item.recipe.originalName
    : item.extraName;

  const newMap = new Map(map);

  const previousMap = newMap.get(key);
  const previousVariant = previousMap?.[variant.string];
  newMap.set(key, {
    ...previousMap,
    [variant.string]: {
      ...variant,
      ...previousVariant,
      originalName,
      count: (previousVariant?.count ?? 0) + 1,
      customers: previousVariant?.customers
        ? [...previousVariant.customers, customer]
        : [customer],
    },
  });
  return newMap;
};

export const makeCookPlan = (
  selections: Swapped<MealPlanGeneratedForIndividualCustomer>[],
  allMeals: Recipe[]
): Map<string, RecipeVariantMap>[] => {
  return defaultDeliveryDays.map((day, deliveryIndex) =>
    selections.reduce<Map<string, RecipeVariantMap>>(
      (startMap, customerSelections) => {
        const cook = customerSelections.deliveries[deliveryIndex];
        if (cook.paused) {
          return new Map<string, RecipeVariantMap>();
        }
        return cook.plans
          .flatMap((plan) => (plan.status === 'active' ? plan.meals : []))
          .reduce(
            (map, item) =>
              updateVariantMap(
                map,
                customerSelections.customer,
                item,
                allMeals
              ),
            startMap
          );
      },
      new Map()
    )
  );
};
