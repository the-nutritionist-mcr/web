export class ImmutableDate {
  public constructor(private date: Date) {}

  public getTime() {
    return this.date.getTime();
  }
}
