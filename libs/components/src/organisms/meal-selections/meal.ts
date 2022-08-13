export interface Meal {
  id?: string;
  name: string;
  description?: string;
  allergens?: string;
  alternates?: {
    customisationId: string;
    recipeId: string;
  }[];
}
