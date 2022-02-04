import { DaysOfWeek } from '../types';
import { CookDay } from './cook-day';
import { mocked } from 'ts-jest/utils';
import { mock } from 'jest-mock-extended';
import { MealsToCook } from './meals-to-cook';
import { ImmutableDate } from '../utils/immutable-date';
import { Recipe, Customer } from '../entities';

jest.mock('./meals-to-cook');

describe('cook day', () => {
  it('allows you to access the dayOfWeek property', () => {
    const cookOne = new CookDay({
      dayOfWeek: DaysOfWeek.Sunday,
      eatingDaysCovered: [],
    });

    expect(cookOne.dayOfWeek).toEqual(DaysOfWeek.Sunday);
  });

  it('allows you to access the eatingDaysCovered property', () => {
    const cookOne = new CookDay({
      dayOfWeek: DaysOfWeek.Sunday,
      eatingDaysCovered: [DaysOfWeek.Thursday, DaysOfWeek.Friday],
    });

    expect(cookOne.eatingDaysCovered).toEqual([
      DaysOfWeek.Thursday,
      DaysOfWeek.Friday,
    ]);
  });

  describe('getMealSelection', () => {
    it('creates a new meal selection with the supplied paramaters', () => {
      const mockMeals = mock<MealsToCook>();

      mocked(MealsToCook).mockReturnValue(mockMeals);

      const cookOne = new CookDay({
        dayOfWeek: DaysOfWeek.Sunday,
        eatingDaysCovered: [DaysOfWeek.Thursday, DaysOfWeek.Friday],
      });

      const date = new ImmutableDate(new Date());

      const recipeOne = mock<Recipe>();
      const recipeTwo = mock<Recipe>();

      const customerOne = mock<Customer>();
      const customerTwo = mock<Customer>();

      const outcome = cookOne.getMealSelection(
        date,
        [recipeOne, recipeTwo],
        [customerOne, customerTwo]
      );

      expect(MealsToCook).toHaveBeenCalledWith(
        date,
        [recipeOne, recipeTwo],
        [customerOne, customerTwo],
        expect.anything(),
        cookOne
      );

      expect(outcome).toBe(mockMeals);
    });
  });
});
