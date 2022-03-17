import { CustomerMealsSelection, isSelectedMeal } from './types';
import { createVariant } from './create-variant';
import { Recipe } from '@tnmw/types';

const stringifyValue = (thing: unknown) =>
  typeof thing === 'number' ? String(thing) : thing;

const stringifyKeys = <T extends Record<string, unknown>>(thing: T) =>
  Object.fromEntries(
    Object.entries(thing).map(([entry, value]) => [
      entry,
      stringifyValue(value),
    ])
  );

const isValueString = (
  entry: [key: string, value: unknown]
): entry is [string, string] => typeof entry[1] === 'string';

const removeNonStringValues = (
  thing: Record<string, unknown>
): Record<string, string> =>
  // eslint-disable-next-line unicorn/no-array-callback-reference
  Object.fromEntries(Object.entries(thing).filter(isValueString));

const normalize = <T extends Record<string, unknown>>(
  thing: T
): Record<string, string> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = removeNonStringValues(stringifyKeys(thing));

  return rest;
};

const titleCase = (string: string) =>
  string
    .toLocaleLowerCase()
    .split(' ')
    .map((word) => `${word.slice(0, 1).toLocaleUpperCase()}${word.slice(1)}`)
    .join(' ');

const convertToStringWithLeadingZero = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${convertToStringWithLeadingZero(
    day
  )}/${convertToStringWithLeadingZero(month)}/${year}`;
};

export const generateLabelData = (
  selections: CustomerMealsSelection,
  useByDate: Date,
  allMeals: Recipe[],
  deliveryNumber: number
): ReadonlyArray<Record<string, string>> =>
  selections
    .flatMap((selection) => {
      const delivery = selection.deliveries[deliveryNumber];

      if (typeof delivery === 'string') {
        return [];
      }

      return delivery.map((item) => {
        const defaultProps = {
          ...selection.customer,
          useBy: `Use by ${formatDate(useByDate)}`,
          customerName: titleCase(
            `${selection.customer.firstName} ${selection.customer.surname}`
          ),
        };
        if (isSelectedMeal(item)) {
          const variant = createVariant(selection.customer, item, allMeals);
          return {
            ...defaultProps,
            ...item.recipe,
            hotOrCold: `Enjoy ${item.recipe.hotOrCold}`,
            allergens: `Contains ${
              item.recipe.allergens?.trim()
                ? item.recipe.allergens.trim()
                : 'no allergens'
            }`,
            itemPlan: item.chosenVariant,
            variantString: variant.string,
            mealLabelString: variant.mealWithVariantString,
            mealName: titleCase(item.recipe.name),
          };
        }
        return {
          ...defaultProps,
          mealName: titleCase(item.chosenVariant),
          itemPlan: 'extra',
        };
      });
    })
    .map((thing) => normalize(thing));
