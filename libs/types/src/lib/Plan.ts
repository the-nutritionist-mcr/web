import { PlanCategory } from './plan-category';

export default interface Plan {
  name: string;
  mealsPerDay: number;
  costPerMeal: number;
  category: PlanCategory;
}
