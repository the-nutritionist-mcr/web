import { CookDay } from './cook-day';
import { PreparedMeal } from './prepared-meal';
import { Recipe, Customer } from '../entities';
import { DaysOfWeek } from '../types';
import { ImmutableDate } from '../utils';
import { mock } from 'jest-mock-extended';
import { MealsToCook } from './meals-to-cook';
import { CustomerDistribution } from './customer-distribution';
import { CustomerMealsDistribution } from './customer-meals-distribution';

type NotReadonly<T> = { -readonly [K in keyof T]: T[K] };

beforeEach(() => {
  jest.resetAllMocks();
});

describe('meals to cook', () => {
  describe('distribute', () => {
    it('correctly distributes the meals supplied by the distribution generator', () => {
      const date = new ImmutableDate(new Date());

      const recipeOne = mock<NotReadonly<Recipe>>();
      recipeOne.tags = [];
      const recipeTwo = mock<NotReadonly<Recipe>>();
      recipeTwo.tags = [];

      const recipes = [recipeOne, recipeTwo];

      const customerOne = mock<NotReadonly<Customer>>();
      customerOne.tags = [];

      const customerTwo = mock<NotReadonly<Customer>>();
      customerTwo.tags = [];

      const cookOne = new CookDay({
        dayOfWeek: DaysOfWeek.Sunday,
        eatingDaysCovered: [DaysOfWeek.Thursday, DaysOfWeek.Friday],
      });

      const customers = [customerOne, customerTwo];

      const mockDistribution = mock<CustomerDistribution>();
      const mockCustomerDistribution = mock<CustomerMealsDistribution>();
      const distributionFactory = {
        getCustomerDistribution: jest.fn(() => mockDistribution),
        getCustomerMealsDistribution: jest.fn(() => mockCustomerDistribution),
      };

      const meals = new MealsToCook(
        date,
        recipes,
        customers,
        distributionFactory,
        cookOne
      );

      const active = jest.fn();
      active.mockImplementation(() => ({ active: true }));

      const selectMeals = jest.fn();

      const mockPreparedMealOne = mock<PreparedMeal>();
      const mockPreparedMealTwo = mock<PreparedMeal>();
      const mockPreparedMealThree = mock<PreparedMeal>();
      const mockPreparedMealFour = mock<PreparedMeal>();

      selectMeals
        .mockImplementationOnce(() => [
          mockPreparedMealOne,
          mockPreparedMealTwo,
        ])
        .mockImplementationOnce(() => [
          mockPreparedMealThree,
          mockPreparedMealFour,
        ]);

      const distribution = meals.distribute(
        {
          active,
        },
        {
          selectMeals,
        }
      );

      expect(distribution).toEqual(mockCustomerDistribution);

      expect(
        distributionFactory.getCustomerMealsDistribution
      ).toHaveBeenCalledWith(
        [mockDistribution, mockDistribution],
        date,
        cookOne
      );
    });

    it('passes through the message if one is supplied by the activator', () => {
      const date = new ImmutableDate(new Date());

      const recipeOne = mock<NotReadonly<Recipe>>();
      recipeOne.tags = [];
      const recipeTwo = mock<NotReadonly<Recipe>>();
      recipeTwo.tags = [];

      const recipes = [recipeOne, recipeTwo];

      const customerOne = mock<NotReadonly<Customer>>();
      customerOne.tags = [];

      const customerTwo = mock<NotReadonly<Customer>>();
      customerTwo.tags = [];

      const cookOne = new CookDay({
        dayOfWeek: DaysOfWeek.Sunday,
        eatingDaysCovered: [DaysOfWeek.Thursday, DaysOfWeek.Friday],
      });

      const customers = [customerOne, customerTwo];

      const mockDistribution = mock<CustomerDistribution>();
      const mockCustomerDistribution = mock<CustomerMealsDistribution>();
      const distributionFactory = {
        getCustomerDistribution: jest.fn(() => mockDistribution),
        getCustomerMealsDistribution: jest.fn(() => mockCustomerDistribution),
      };

      const meals = new MealsToCook(
        date,
        recipes,
        customers,
        distributionFactory,
        cookOne
      );

      const active = jest.fn();
      active
        .mockImplementationOnce(() => ({ active: false, reason: 'no reason' }))
        .mockImplementationOnce(() => ({ active: true }));

      const selectMeals = jest.fn();

      selectMeals.mockImplementation(() => []);

      meals.distribute(
        {
          active,
        },
        {
          selectMeals,
        }
      );

      expect(distributionFactory.getCustomerDistribution).toHaveBeenCalledWith(
        expect.anything(),
        customerOne,
        false,
        'no reason'
      );
    });

    it('marks distributions as inactive based on the response from active', () => {
      const date = new ImmutableDate(new Date());

      const recipeOne = mock<NotReadonly<Recipe>>();
      recipeOne.tags = [];
      const recipeTwo = mock<NotReadonly<Recipe>>();
      recipeTwo.tags = [];

      const recipes = [recipeOne, recipeTwo];

      const customerOne = mock<NotReadonly<Customer>>();
      customerOne.tags = [];
      const customerTwo = mock<NotReadonly<Customer>>();
      customerTwo.tags = [];

      const cookOne = new CookDay({
        dayOfWeek: DaysOfWeek.Sunday,
        eatingDaysCovered: [DaysOfWeek.Thursday, DaysOfWeek.Friday],
      });

      const customers = [customerOne, customerTwo];

      const mockDistribution = mock<CustomerDistribution>();
      const mockCustomerDistribution = mock<CustomerMealsDistribution>();
      const distributionFactory = {
        getCustomerDistribution: jest.fn(() => mockDistribution),
        getCustomerMealsDistribution: jest.fn(() => mockCustomerDistribution),
      };

      const meals = new MealsToCook(
        date,
        recipes,
        customers,
        distributionFactory,
        cookOne
      );

      const active = jest.fn();
      active
        .mockImplementationOnce(() => ({ active: false }))
        .mockImplementationOnce(() => ({ active: true }));

      const selectMeals = jest.fn();

      selectMeals.mockImplementation(() => []);

      meals.distribute(
        {
          active,
        },
        {
          selectMeals,
        }
      );

      expect(distributionFactory.getCustomerDistribution).toHaveBeenCalledWith(
        expect.anything(),
        customerOne,
        false,
        undefined
      );

      expect(distributionFactory.getCustomerDistribution).toHaveBeenCalledWith(
        expect.anything(),
        customerTwo,
        true,
        undefined
      );
    });
  });
});
