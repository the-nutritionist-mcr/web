export interface StandardPlan {
  name: string;
  daysPerWeek: number;
  itemsPerDay: number;
  isExtra: boolean;
  totalMeals: number;
  pauseStart?: number;
  pauseEnd?: number;
}
