import { ActivePlanWithMeals } from '@tnmw/types';

type Counts = {
  [key: string]: number;
};

export const countsFromPlans = (plan: ActivePlanWithMeals) => {
  return plan.meals.reduce<Counts>((accum, meal) => {
    const id = meal.isExtra ? meal.extraName : meal.recipe.id;

    return id in accum
      ? { ...accum, [id]: accum[id] + 1 }
      : { ...accum, [id]: 1 };
  }, {});
};
