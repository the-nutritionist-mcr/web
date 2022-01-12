import Recipe from "../domain/Recipe";
import { RecipeVariantMap } from "../types/CookPlan";
import { CustomerMealsSelection, SelectedItem } from "./types";
import { defaultDeliveryDays } from "../lib/config";
import { createVariant } from "./create-variant";
import { isSelectedMeal } from "./is-selected-meal";
import Customer from "../domain/Customer";

const updateVariantMap = (
  map: Map<string, RecipeVariantMap>,
  customer: Customer,
  item: SelectedItem,
  allMeals: Recipe[]
) => {
  const variant = createVariant(customer, item, allMeals);
  const key = isSelectedMeal(item) ? item.recipe.name : item.chosenVariant;

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
        : [customer]
    }
  });
  return newMap;
};

export const makeCookPlan = (
  selections: CustomerMealsSelection,
  allMeals: Recipe[]
): Map<string, RecipeVariantMap>[] => {
  return defaultDeliveryDays.map((day, deliveryIndex) =>
    selections.reduce<Map<string, RecipeVariantMap>>(
      (startMap, customerSelections) => {
        const cook = customerSelections.deliveries[deliveryIndex];
        if (typeof cook === "string") {
          return startMap;
        }
        return cook.reduce(
          (map, item) =>
            updateVariantMap(map, customerSelections.customer, item, allMeals),
          startMap
        );
      },
      new Map()
    )
  );
};
