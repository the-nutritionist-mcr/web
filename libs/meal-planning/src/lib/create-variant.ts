import {
  BackendCustomer,
  DeliveryItem,
  DeliveryMeal,
  Exclusion,
  PlanLabels,
  Recipe,
} from '@tnmw/types';
import { SelectedItem, SelectedMeal } from './types';

const hasExclusions = (exclusion: Exclusion, meal: Recipe | undefined) =>
  meal?.potentialExclusions.some((value) => value.id === exclusion.id);

const isSelectedMeal = (item: unknown): item is DeliveryMeal => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemAsAny = item as any;

  return !itemAsAny.isExtra;
};

const createVariantString = (
  customer: BackendCustomer,
  item: SelectedItem,
  allMeals: Recipe[]
): string => {
  if (!isSelectedMeal(item)) {
    return item.chosenVariant;
  }

  const realMeal = allMeals.find((theMeal) => theMeal.id === item.recipe.id);

  const matchingExclusions = customer.customisations.filter((allergen) => {
    return realMeal?.potentialExclusions.some(
      (value) => value.id === allergen.id
    );
  });

  const planNamesMap: { [K in PlanLabels]: string } = {
    Equilibrium: 'EQ',
    Mass: 'MASS',
    Micro: 'MICRO',
    'Ultra Micro': 'ULTRA',
    'Low-CHO': 'L-CHO',
    'Seasonal Soup': 'SOUP',
    Breakfast: 'BFAST',
    Snacks: 'SNACK',
  };

  const variantName =
    planNamesMap[item.chosenVariant as PlanLabels] ?? item.chosenVariant;

  return matchingExclusions.length > 0
    ? `${variantName} (${matchingExclusions
        .map((exclusion) => exclusion.name)
        .join(', ')})`
    : `${variantName}`;
};

const createMealWithVariantString = (
  customer: BackendCustomer,
  meal: SelectedMeal,
  allMeals: Recipe[]
): string =>
  `${meal.recipe.shortName}/${createVariantString(customer, meal, allMeals)}`;

const createCustomisationsString = (
  customer: BackendCustomer,
  item: DeliveryItem,
  allMeals: Recipe[]
) => {
  if (item.isExtra) {
    return '';
  }
  const realMeal = allMeals.find(
    (theMeal) => !item.isExtra && theMeal.id === item.recipe.id
  );

  const matchingExclusions = customer.customisations.filter((allergen) => {
    return realMeal?.potentialExclusions.some(
      (value) => value.id === allergen.id
    );
  });

  return matchingExclusions.map((exclusion) => exclusion.name).join(', ');
};

export const createVariant = (
  customer: BackendCustomer,
  meal: DeliveryItem,
  allMeals: Recipe[]
): {
  customisation: boolean;
  allergen: boolean;
  string: string;
  mealWithVariantString: string;
  customisations: string;
} => {
  if (!isSelectedMeal(meal)) {
    return {
      customisations: '',
      customisation: false,
      allergen: false,
      string: meal.extraName,
      mealWithVariantString: meal.extraName,
    };
  }

  const realMeal = allMeals.find((theMeal) => theMeal.id === meal.recipe.id);

  const matchingExclusions = customer.customisations.filter((exclusion) =>
    hasExclusions(exclusion, realMeal)
  );

  const string =
    matchingExclusions.length > 0
      ? `${meal.chosenVariant} (${matchingExclusions
          .map((exclusion) => exclusion.name)
          .join(', ')})`
      : `${meal.chosenVariant}`;

  return {
    customisation: matchingExclusions.length > 0,
    customisations: createCustomisationsString(customer, meal, allMeals),
    allergen: matchingExclusions.length > 0 && matchingExclusions[0].allergen,
    mealWithVariantString: createMealWithVariantString(
      customer,
      meal,
      allMeals
    ),
    string,
  };
};
