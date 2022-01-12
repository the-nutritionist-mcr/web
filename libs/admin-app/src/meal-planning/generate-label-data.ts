import { CustomerMealsSelection, isSelectedMeal } from "./types";
import { createVariant } from "./create-variant";
import Recipe from "../domain/Recipe";

const stringifyValue = (thing: unknown) =>
  typeof thing === "number" ? String(thing) : thing;

const stringifyKeys = <T extends Record<string, unknown>>(thing: T) =>
  Object.fromEntries(
    Object.entries(thing).map(([entry, value]) => [
      entry,
      stringifyValue(value)
    ])
  );

const isValueString = (
  entry: [key: string, value: unknown]
): entry is [string, string] => typeof entry[1] === "string";

const removeNonStringValues = (
  thing: Record<string, unknown>
): Record<string, string> =>
  Object.fromEntries(Object.entries(thing).filter(isValueString));

const normalize = <T extends Record<string, unknown>>(
  thing: T
): Record<string, string> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = removeNonStringValues(stringifyKeys(thing));

  // eslint-disable-next-line no-console
  console.log(rest);

  return rest;
};

export const generateLabelData = (
  selections: CustomerMealsSelection,
  allMeals: Recipe[],
  deliveryNumber: number
): ReadonlyArray<Record<string, string>> =>
  selections
    .flatMap(selection => {
      const delivery = selection.deliveries[deliveryNumber];

      if (typeof delivery === "string") {
        return [];
      }

      return delivery.map(item => {
        if (isSelectedMeal(item)) {
          const variant = createVariant(selection.customer, item, allMeals);
          return {
            ...selection.customer,
            ...item.recipe,
            itemPlan: item.chosenVariant,
            variantString: variant.string,
            mealLabelString: variant.mealWithVariantString,
            mealName: item.recipe.name
          };
        }
        return {
          ...selection.customer,
          mealName: item.chosenVariant,
          itemPlan: "extra"
        };
      });
    })
    .map(normalize);
