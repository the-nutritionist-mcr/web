import { createVariant } from './create-variant';
import { defaultDeliveryDays } from '@tnmw/config';
import {
  BackendCustomer,
  DeliveryItem,
  MealPlanGeneratedForIndividualCustomer,
  Recipe,
  RecipeVariantMap,
} from '@tnmw/types';

const updateVariantMap = (
  map: Map<string, RecipeVariantMap>,
  customer: BackendCustomer,
  item: DeliveryItem,
  allMeals: Recipe[]
) => {
  const variant = createVariant(customer, item, allMeals);
  const key = !item.isExtra ? item.recipe.name : item.extraName;

  const newMap = new Map(map);

  const previousMap = newMap.get(key);
  const previousVariant = previousMap?.[variant.string];
  newMap.set(key, {
    ...previousMap,
    [variant.string]: {
      ...variant,
      ...previousVariant,
      count: (previousVariant?.count ?? 0) + 1,
      customers: previousVariant?.customers
        ? [...previousVariant.customers, customer]
        : [customer],
    },
  });
  return newMap;
};

export const makeCookPlan = (
  selections: MealPlanGeneratedForIndividualCustomer[],
  allMeals: Recipe[]
): Map<string, RecipeVariantMap>[] => {
  return defaultDeliveryDays.map((day, deliveryIndex) =>
    selections.reduce<Map<string, RecipeVariantMap>>(
      (startMap, customerSelections) => {
        const cook = customerSelections.deliveries[deliveryIndex];
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
