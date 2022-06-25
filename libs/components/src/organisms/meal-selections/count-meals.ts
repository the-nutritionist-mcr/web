import { MealCategoryWithSelections } from './meal-category';

export const countMeals = (categories: MealCategoryWithSelections[]) =>
  categories.reduce(
    (accumcategory, category) =>
      accumcategory +
      category.selections.reduce(
        (accum, delivery) =>
          accum + delivery.reduce((accum2, meal) => accum2 + 1, 0),
        0
      ),
    0
  );

export const remainingMeals = (categories: MealCategoryWithSelections[]) =>
  categories.reduce((total, category) => total + category.maxMeals, 0) -
  countMeals(categories);
