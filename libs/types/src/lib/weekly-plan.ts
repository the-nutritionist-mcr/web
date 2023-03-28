import Recipe from './Recipe';

export const isWeeklyPlan = (plan: unknown): plan is WeeklyPlan => {
  if (typeof plan !== 'object') {
    return false;
  }

  const asPlan = plan as WeeklyPlan;

  if (typeof asPlan.timestamp !== 'number') {
    return false;
  }

  if (!Array.isArray(asPlan.cooks)) {
    return false;
  }

  // if (
  //   !asPlan.cooks.every(
  //     (item) => Array.isArray(item) && item.every((recipe) => assertIsRecipe(recipe))
  //   )
  // ) {
  //   return false;
  // }

  if (!asPlan.dates.every((item) => typeof item === 'string')) {
    return false;
  }
  return true;
};

export interface WeeklyPlan {
  timestamp: number;
  cooks: Recipe[][];
  dates: string[];
}
