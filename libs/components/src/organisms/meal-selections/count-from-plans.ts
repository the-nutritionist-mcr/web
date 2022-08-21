import { ActivePlanWithMeals } from '@tnmw/types';

type Counts = {
  [key: string]: number;
};

export const countsFromPlans = (plan: ActivePlanWithMeals) => {
  return plan.meals.reduce<Counts>((accum, meal) => {
    if (meal.isExtra) {
      return {};
    }
    const id = meal.recipe.id;

    return id in accum
      ? { ...accum, [id]: accum[id] + 1 }
      : { ...accum, [id]: 1 };
  }, {});
};
