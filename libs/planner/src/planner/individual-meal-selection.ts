import { ISelection, Variant } from "@/entities";

export class IndividualMealSelection implements ISelection {
  public constructor(
    public readonly variant: Variant,
    public readonly quantity: number
  ) {}
}
