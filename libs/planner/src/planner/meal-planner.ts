import { DaysOfWeek } from '../types';
import { CookDay } from './cook-day';

const allDaysOfWeek = [
  DaysOfWeek.Monday,
  DaysOfWeek.Tuesday,
  DaysOfWeek.Wednesday,
  DaysOfWeek.Thursday,
  DaysOfWeek.Friday,
  DaysOfWeek.Saturday,
  DaysOfWeek.Sunday
];

export class MealPlanner {
  public constructor(public readonly cookDays: ReadonlyArray<CookDay>) {
    const coveredDays = cookDays.flatMap(day => day.eatingDaysCovered);
    const missing = allDaysOfWeek.find(day => !coveredDays.includes(day));

    if (missing) {
      throw new Error(`None of the configured cook days cover ${missing}`);
    }

    const daySet = new Set();

    coveredDays.forEach(day => {
      if (daySet.has(day)) {
        throw new Error(`More than one cook day covers ${day}`);
      } else {
        daySet.add(day);
      }
    });
  }
}
