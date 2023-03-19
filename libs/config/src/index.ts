import { ExtrasLabels, Plan, PlanLabels } from '@tnmw/types';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const daysPerWeekOptions = [7, 6, 5];

export const planLabels: ReadonlyArray<PlanLabels> = [
  'Equilibrium',
  'Mass',
  'Micro',
  'Ultra Micro',
  'Low-CHO',
  'Seasonal Soup',
  'Breakfast',
  'Snacks',
];

export const itemFamilies = [
  {
    name: 'Low-CHO',
    isExtra: false,
    shortName: 'LC',
  },
  {
    name: 'Mass',
    isExtra: false,
    shortName: 'MA',
  },
  {
    name: 'Equilibrium',
    isExtra: false,
    shortName: 'EQ',
  },
  {
    name: 'Micro',
    isExtra: false,
    shortName: 'MI',
  },
  {
    name: 'Ultra Micro',
    isExtra: false,
    shortName: 'UM',
  },
  {
    name: 'Seasonal Soup',
    isExtra: true,
    shortName: 'SS',
  },
  {
    name: 'Breakfast',
    isExtra: true,
    shortName: 'B',
  },
  {
    name: 'Snacks',
    isExtra: true,
    shortName: 'SN',
  },
];

export const defaultDeliveryDays = ['Monday', 'Thursday'];

export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const extrasLabels: ReadonlyArray<ExtrasLabels> = [
  'Breakfast',
  'Snack',
  'Large Snack',
  'Seasonal Soup',
];

export const plans: Plan[] = [
  {
    name: 'Mass 1',
    category: 'Mass',
    mealsPerDay: 1,
    costPerMeal: 902,
  },
  {
    name: 'Mass 2',
    category: 'Mass',
    mealsPerDay: 2,
    costPerMeal: 885,
  },
  {
    name: 'Mass 3',
    category: 'Mass',
    mealsPerDay: 3,
    costPerMeal: 885,
  },
  {
    name: 'EQ 1',
    category: 'EQ',
    mealsPerDay: 1,
    costPerMeal: 787,
  },
  {
    name: 'EQ 2',
    category: 'EQ',
    mealsPerDay: 2,
    costPerMeal: 760,
  },
  {
    name: 'EQ 3',
    category: 'EQ',
    mealsPerDay: 3,
    costPerMeal: 760,
  },
  {
    name: 'Micro 1',
    category: 'Micro',
    mealsPerDay: 1,
    costPerMeal: 673,
  },
  {
    name: 'Micro 2',
    category: 'Micro',
    mealsPerDay: 2,
    costPerMeal: 663,
  },
  {
    name: 'Micro 3',
    category: 'Micro',
    mealsPerDay: 3,
    costPerMeal: 663,
  },
  {
    name: 'Ultra-Micro 1',
    category: 'Ultra-Micro',
    mealsPerDay: 1,
    costPerMeal: 635,
  },
  {
    name: 'Ultra-Micro 2',
    category: 'Ultra-Micro',
    mealsPerDay: 2,
    costPerMeal: 625,
  },
  {
    name: 'Ultra-Micro 3',
    category: 'Ultra-Micro',
    mealsPerDay: 3,
    costPerMeal: 625,
  },
];

export { default as calendarFormat } from './lib/calendar-format';
/* eslint-disable sonarjs/no-duplicate-string */
