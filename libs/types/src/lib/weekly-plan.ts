import Recipe, { isRecipe } from './Recipe';

export const isWeeklyPlan = (plan: unknown): plan is WeeklyPlan => {
  if (typeof plan !== 'object') {
    console.log('not object');
    return false;
  }

  const asPlan = plan as WeeklyPlan;

  if (typeof asPlan.timestamp !== 'number') {
    console.log('twelve');
    return false;
  }

  if (!Array.isArray(asPlan.cooks)) {
    console.log('thirteen');
    return false;
  }

  if (
    !asPlan.cooks.every(
      (item) => Array.isArray(item) && item.every((recipe) => isRecipe(recipe))
    )
  ) {
    console.log('fourteen');
    return false;
  }

  if (!asPlan.dates.every((item) => typeof item === 'string')) {
    console.log('fifteen');
    return false;
  }
  return true;
};

export interface WeeklyPlan {
  timestamp: number;
  cooks: Recipe[][];
  dates: string[];
}
