import { Customer, Recipe, Tag } from '../entities';
import { mock } from 'jest-mock-extended';
import { CustomerDistribution } from './customer-distribution';

type NotReadonly<T> = { -readonly [K in keyof T]: T[K] };

describe('customer distribution', () => {
  it('generates a set of prepared meals from the selected meals passed in', () => {
    const recipeOne = mock<Recipe>();
    const recipeTwo = mock<Recipe>();

    const selections = [
      {
        recipe: recipeOne,
        variant: { name: 'EQ' },
      },
      {
        recipe: recipeTwo,
        variant: { name: 'EQ' },
      },
    ];

    const customerOne = mock<NotReadonly<Customer>>();

    customerOne.tags = [];

    const distribution = new CustomerDistribution(
      selections,
      customerOne,
      true,
      'none'
    );

    expect(distribution.meals).toHaveLength(2);
    expect(distribution.customer).toEqual(customerOne);
    expect(distribution.meals[0]?.recipe).toEqual(recipeOne);
    expect(distribution.meals[1]?.recipe).toEqual(recipeTwo);
  });

  it('tags the prepared meals appropriately', () => {
    const tagOne: Tag = {
      id: '1',
      name: 'foo',
      attributes: [],
    };

    const tagTwo: Tag = {
      id: '2',
      name: 'bar',
      attributes: [],
    };

    const tagThree: Tag = {
      id: '3',
      name: 'baz',
      attributes: [],
    };

    const tagFour: Tag = {
      id: '4',
      name: 'bap',
      attributes: [],
    };

    const tagFive: Tag = {
      id: '5',
      name: 'bapz',
      attributes: [],
    };

    const recipeOne = mock<NotReadonly<Recipe>>();
    recipeOne.tags = [tagOne];
    const recipeTwo = mock<NotReadonly<Recipe>>();
    recipeTwo.tags = [tagTwo, tagThree, tagFour];

    const selections = [
      {
        recipe: recipeOne,
        variant: { name: 'EQ' },
      },
      {
        recipe: recipeTwo,
        variant: { name: 'EQ' },
      },
    ];

    const customerOne = mock<NotReadonly<Customer>>();

    customerOne.tags = [tagThree, tagFour, tagFive];

    const distribution = new CustomerDistribution(
      selections,
      customerOne,
      true,
      'none'
    );

    expect(distribution.meals).toHaveLength(2);
    expect(distribution.meals[0]?.tags).toHaveLength(0);
    expect(distribution.meals[1]?.tags).toEqual([tagThree, tagFour]);
  });
});
