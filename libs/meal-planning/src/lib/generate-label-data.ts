import { createVariant } from './create-variant';
import {
  Recipe,
  DeliveryItem,
  BackendCustomer,
  DeliveryMeal,
  SwappedMealPlan,
  Swapped,
} from '@tnmw/types';

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

const isSelectedMeal = (item: unknown): item is DeliveryMeal => {
  const itemAsAny = item as any;

  return !itemAsAny.isExtra;
};

const makeLabelObject = (
  customer: BackendCustomer,
  item: Swapped<DeliveryItem>,
  useByDate: Date,
  allMeals: Recipe[]
): Record<string, string> => {
  if (isSelectedMeal(item)) {
    const variant = createVariant(customer, item, allMeals);

    const { hotOrCold, originalName } = item.recipe;

    return {
      originalName: titleCase(originalName),
      // eslint-disable-next-line unicorn/consistent-destructuring
      customerName: titleCase(`${customer.firstName} ${customer.surname}`),
      surname: customer.surname,

      // eslint-disable-next-line unicorn/consistent-destructuring
      mealName: titleCase(item.recipe.name),

      // eslint-disable-next-line unicorn/consistent-destructuring
      description: item.recipe.description ?? '',
      allergens:
        // eslint-disable-next-line unicorn/consistent-destructuring
        item.recipe.allergens?.trim()
          ? // eslint-disable-next-line unicorn/consistent-destructuring
            item.recipe.allergens.trim()
          : 'no allergens',
      itemPlan:
        item.chosenVariant === 'Equilibrium' ? 'EQ' : item.chosenVariant,
      customisations: variant.customisations,
      hotOrCold: `Enjoy ${hotOrCold}`,
      useBy: `Use by ${formatDate(useByDate)}`,
    };
  }
  return {
    // eslint-disable-next-line unicorn/consistent-destructuring
    customerName: titleCase(`${customer.firstName} ${customer.surname}`),
    surname: customer.surname,
    originalName: '',
    mealName: titleCase(item.extraName),
    description: '',
    allergens: '',
    itemPlan: 'Extra',
    customisations: '',
    hotOrCold: '',
    useBy: `Use by ${formatDate(useByDate)}`,
  };
};

const sortFunction = (a: Record<string, string>, b: Record<string, string>) => {
  if (a['originalName'] > b['originalName']) {
    return 1;
  }

  if (a['originalName'] < b['originalName']) {
    return -1;
  }

  if (a['itemPlan'] > b['itemPlan']) {
    return 1;
  }

  if (a['itemPlan'] < b['itemPlan']) {
    return -1;
  }

  if (a['surname'] > b['surname']) {
    return 1;
  }

  if (a['surname'] < b['surname']) {
    return -1;
  }

  return 0;
};

export const generateLabelData = (
  selections: SwappedMealPlan[],
  useByDate: Date,
  allMeals: Recipe[],
  deliveryNumber: number
): ReadonlyArray<Record<string, string>> =>
  // eslint-disable-next-line fp/no-mutating-methods
  selections
    .flatMap((selection) => {
      const delivery = selection.deliveries[deliveryNumber];

      if (delivery.paused) {
        return [];
      }

      return delivery.plans.flatMap((plan) =>
        plan.status === 'active'
          ? plan.meals.map((deliveryItem) =>
              makeLabelObject(
                selection.customer,
                deliveryItem,
                useByDate,
                allMeals
              )
            )
          : []
      );
    })
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .map((item) => normalize(item))
    .slice()
    .sort(sortFunction)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ surname, ...rest }) => rest);
