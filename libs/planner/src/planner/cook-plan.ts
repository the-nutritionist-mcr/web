import { DaysOfWeek } from "@/types";
import { PreparedMeal } from "./prepared-meal";

export class CookPlan {
  public constructor(
    public readonly dayOfWeek: DaysOfWeek,
    public readonly meals: ReadonlyArray<PreparedMeal>
  ) {}
}
