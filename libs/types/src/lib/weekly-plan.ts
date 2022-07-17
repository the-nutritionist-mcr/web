import Recipe, { isRecipe } from './Recipe';

export const isWeeklyPlan = (plan: unknown): plan is WeeklyPlan => {
  if (typeof plan !== 'object') {
    return false;
  }

  const asPlan = plan as WeeklyPlan;

  return (
    typeof asPlan.timestamp === 'string' &&
    Array.isArray(asPlan.cooks) &&
    asPlan.cooks.every(
      (item) => Array.isArray(item) && item.every((recipe) => isRecipe(recipe))
    ) &&
    asPlan.dates.every((item) => typeof item === 'string')
  );
};

export interface WeeklyPlan {
  timestamp: string;
  cooks: Recipe[][];
  dates: string[];
}
