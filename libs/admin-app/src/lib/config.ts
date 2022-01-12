import Plan from "../domain/Plan";

/* eslint-disable sonarjs/no-duplicate-string */
export type PlanCategory = "Mass" | "EQ" | "Micro" | "Ultra-Micro";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const daysPerWeekOptions = [7, 6, 5];

export const planLabels = [
  "EQ",
  "Mass",
  "Micro",
  "Ultra-Micro",
  "Carb Free",
] as const;

export const defaultDeliveryDays = ["Monday", "Wednesday", "Friday"];

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const extrasLabels = ["Breakfast", "Snack", "Large Snack"] as const;

export const plans: Plan[] = [
  {
    name: "Mass 1",
    category: "Mass",
    mealsPerDay: 1,
    costPerMeal: 902,
  },
  {
    name: "Mass 2",
    category: "Mass",
    mealsPerDay: 2,
    costPerMeal: 885,
  },
  {
    name: "Mass 3",
    category: "Mass",
    mealsPerDay: 3,
    costPerMeal: 885,
  },
  {
    name: "EQ 1",
    category: "EQ",
    mealsPerDay: 1,
    costPerMeal: 787,
  },
  {
    name: "EQ 2",
    category: "EQ",
    mealsPerDay: 2,
    costPerMeal: 760,
  },
  {
    name: "EQ 3",
    category: "EQ",
    mealsPerDay: 3,
    costPerMeal: 760,
  },
  {
    name: "Micro 1",
    category: "Micro",
    mealsPerDay: 1,
    costPerMeal: 673,
  },
  {
    name: "Micro 2",
    category: "Micro",
    mealsPerDay: 2,
    costPerMeal: 663,
  },
  {
    name: "Micro 3",
    category: "Micro",
    mealsPerDay: 3,
    costPerMeal: 663,
  },
  {
    name: "Ultra-Micro 1",
    category: "Ultra-Micro",
    mealsPerDay: 1,
    costPerMeal: 635,
  },
  {
    name: "Ultra-Micro 2",
    category: "Ultra-Micro",
    mealsPerDay: 2,
    costPerMeal: 625,
  },
  {
    name: "Ultra-Micro 3",
    category: "Ultra-Micro",
    mealsPerDay: 3,
    costPerMeal: 625,
  },
];
/* eslint-disable sonarjs/no-duplicate-string */
