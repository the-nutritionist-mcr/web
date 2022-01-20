import { DaysOfWeek } from '../types';
import { CookDay } from './cook-day';
import { MealPlanner } from './meal-planner';

describe('The meal planner', () => {
  it("should throw an error if the supplied cook days don't cover all seven days of the week", () => {
    const cookOne = new CookDay({
      dayOfWeek: DaysOfWeek.Sunday,
      eatingDaysCovered: [
        DaysOfWeek.Monday,
        DaysOfWeek.Tuesday,
        DaysOfWeek.Wednesday
      ]
    });

    const cookTwo = new CookDay({
      dayOfWeek: DaysOfWeek.Thursday,
      eatingDaysCovered: [
        DaysOfWeek.Thursday,
        DaysOfWeek.Friday,
        DaysOfWeek.Sunday
      ]
    });

    expect(() => new MealPlanner([cookOne, cookTwo])).toThrow(
      new Error(`None of the configured cook days cover ${DaysOfWeek.Saturday}`)
    );
  });

  it('should throw an error if the supplied cook days overlap coverage', () => {
    const cookOne = new CookDay({
      dayOfWeek: DaysOfWeek.Sunday,
      eatingDaysCovered: [
        DaysOfWeek.Monday,
        DaysOfWeek.Tuesday,
        DaysOfWeek.Wednesday,
        DaysOfWeek.Thursday
      ]
    });

    const cookTwo = new CookDay({
      dayOfWeek: DaysOfWeek.Thursday,
      eatingDaysCovered: [
        DaysOfWeek.Thursday,
        DaysOfWeek.Friday,
        DaysOfWeek.Saturday,
        DaysOfWeek.Sunday
      ]
    });

    expect(() => new MealPlanner([cookOne, cookTwo])).toThrow(
      new Error(`More than one cook day covers ${DaysOfWeek.Thursday}`)
    );
  });
});
