import {
  CustomerWithChargebeePlan,
  Exclusion,
  HotOrCold,
  Recipe,
} from '@tnmw/types';
import { mock } from 'jest-mock-extended';
import { makeCookPlan } from './make-cook-plan';

describe('make cook plan', () => {
  it('should list customers within each variant', () => {
    const noCheese = mock<Exclusion>();
    noCheese.name = 'No cheese';
    noCheese.id = '1';

    const noTuna = mock<Exclusion>();
    noTuna.name = 'No cheese';
    noTuna.id = '2';

    const recipeOne: Recipe = {
      id: '0',
      hotOrCold: HotOrCold.Hot,
      shortName: 'foo',
      name: 'foo-recipe',
      potentialExclusions: [],
    };

    const recipeTwo: Recipe = {
      id: '1',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bar',
      name: 'bar-recipe',
      potentialExclusions: [],
    };

    const recipeThree: Recipe = {
      id: '2',
      hotOrCold: HotOrCold.Hot,
      shortName: 'baz',
      name: 'baz-recipe',
      potentialExclusions: [noCheese],
    };

    const recipeFour: Recipe = {
      id: '5',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bap',
      name: 'bap-recipe',
      potentialExclusions: [noCheese],
    };

    const recipeFive: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls',
      name: 'balls-recipe',
      potentialExclusions: [],
    };

    const recipeSix: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls',
      name: 'balls-recipe',
      potentialExclusions: [noCheese, noTuna],
    };

    const recipeSeven: Recipe = {
      id: '11',
      hotOrCold: HotOrCold.Hot,
      shortName: 'foo-two',
      name: 'foo-two-recipe',
      potentialExclusions: [],
    };

    const recipeEight: Recipe = {
      id: '15',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bar-two',
      name: 'bar-recipe-two',
      potentialExclusions: [],
    };

    const recipeNine: Recipe = {
      id: '2',
      hotOrCold: HotOrCold.Hot,
      shortName: 'baz-two',
      name: 'baz-recipe-two',
      potentialExclusions: [],
    };

    const recipeTen: Recipe = {
      id: '5',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bap-two',
      name: 'bap-recipe-two',
      potentialExclusions: [noCheese],
    };

    const recipeEleven: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls-two',
      name: 'balls-recipe-two',
      potentialExclusions: [noTuna],
    };

    const recipeTwelve: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls-two',
      name: 'balls-recipe-two',
      potentialExclusions: [],
    };
    const mockCustomer1 = mock<CustomerWithChargebeePlan>();
    mockCustomer1.exclusions = [noCheese];

    const mockCustomer2 = mock<CustomerWithChargebeePlan>();
    mockCustomer2.exclusions = [noCheese, noTuna];

    const mockCustomer3 = mock<CustomerWithChargebeePlan>();
    mockCustomer3.exclusions = [];

    const selection = [
      {
        customer: mockCustomer1,
        deliveries: [
          [
            {
              recipe: recipeOne,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeTwo,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeThree,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
          ],
          [
            {
              recipe: recipeOne,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeTwo,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeThree,
              chosenVariant: 'Mass',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
          ],
          [
            {
              recipe: recipeOne,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeTwo,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeThree,
              chosenVariant: 'Mass',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
          ],
        ],
      },
      {
        customer: mockCustomer2,
        deliveries: [
          [
            {
              recipe: recipeThree,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeFive,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeSix,
              chosenVariant: 'EQ',
            },
          ],
          [
            {
              recipe: recipeThree,
              chosenVariant: 'Micro',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeFive,
              chosenVariant: 'EQ',
            },
            {
              chosenVariant: 'Breakfast',
            },
            {
              recipe: recipeSix,
              chosenVariant: 'EQ',
            },
          ],
          [
            {
              recipe: recipeThree,
              chosenVariant: 'Micro',
            },
            {
              recipe: recipeFour,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeFive,
              chosenVariant: 'EQ',
            },
            {
              chosenVariant: 'Breakfast',
            },
            {
              recipe: recipeSix,
              chosenVariant: 'EQ',
            },
          ],
        ],
      },
      {
        customer: mockCustomer3,
        deliveries: [
          [
            {
              recipe: recipeThree,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeSeven,
              chosenVariant: 'Mass',
            },
            {
              chosenVariant: 'Breakfast',
            },
            {
              recipe: recipeNine,
              chosenVariant: 'EQ',
            },
          ],
          [
            {
              recipe: recipeThree,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeSeven,
              chosenVariant: 'Mass',
            },
            {
              recipe: recipeEight,
              chosenVariant: 'EQ',
            },
            {
              chosenVariant: 'Breakfast',
            },
          ],
          [
            {
              recipe: recipeThree,
              chosenVariant: 'EQ',
            },
            {
              recipe: recipeSeven,
              chosenVariant: 'Mass',
            },
            {
              recipe: recipeEight,
              chosenVariant: 'EQ',
            },
            {
              chosenVariant: 'Breakfast',
            },
          ],
        ],
      },
    ];

    const [dayOne, dayTwo] = makeCookPlan(selection, [
      recipeOne,
      recipeTwo,
      recipeThree,
      recipeFour,
      recipeFive,
      recipeSix,
      recipeSeven,
      recipeEight,
      recipeNine,
      recipeTen,
      recipeEleven,
      recipeTwelve,
    ]);

    expect(
      dayOne.get('baz-recipe')?.['EQ (No cheese)'].customers
    ).toBeDefined();

    expect(dayOne.get('baz-recipe')?.['EQ'].customers).toEqual([mockCustomer3]);

    expect(dayOne.get('baz-recipe')?.['EQ (No cheese)'].customers).toEqual([
      mockCustomer1,
      mockCustomer2,
    ]);

    expect(dayTwo.get('baz-recipe')?.['Mass (No cheese)'].customers).toEqual([
      mockCustomer1,
    ]);

    expect(dayTwo.get('baz-recipe')?.['Micro (No cheese)'].customers).toEqual([
      mockCustomer2,
    ]);
  });

  it.skip('should correctly count extras', () => {
    const noCheese = mock<Exclusion>();
    noCheese.name = 'No cheese';
    noCheese.id = '1';

    const noTuna = mock<Exclusion>();
    noTuna.name = 'No cheese';
    noTuna.id = '2';

    const recipeOne: Recipe = {
      id: '0',
      hotOrCold: HotOrCold.Hot,
      shortName: 'foo',
      name: 'foo-recipe',
      potentialExclusions: [],
    };

    const recipeTwo: Recipe = {
      id: '1',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bar',
      name: 'bar-recipe',
      potentialExclusions: [],
    };

    const recipeThree: Recipe = {
      id: '2',
      hotOrCold: HotOrCold.Hot,
      shortName: 'baz',
      name: 'baz-recipe',
      potentialExclusions: [noCheese],
    };

    const recipeFour: Recipe = {
      id: '5',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bap',
      name: 'bap-recipe',
      potentialExclusions: [noCheese],
    };

    const recipeFive: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls',
      name: 'balls-recipe',
      potentialExclusions: [],
    };

    const recipeSix: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls',
      name: 'balls-recipe',
      potentialExclusions: [noCheese, noTuna],
    };

    const recipeSeven: Recipe = {
      id: '11',
      hotOrCold: HotOrCold.Hot,
      shortName: 'foo-two',
      name: 'foo-two-recipe',
      potentialExclusions: [],
    };

    const recipeEight: Recipe = {
      id: '15',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bar-two',
      name: 'bar-recipe-two',
      potentialExclusions: [],
    };

    const recipeNine: Recipe = {
      id: '2',
      hotOrCold: HotOrCold.Hot,
      shortName: 'baz-two',
      name: 'baz-recipe-two',
      potentialExclusions: [],
    };

    const recipeTen: Recipe = {
      id: '5',
      hotOrCold: HotOrCold.Hot,
      shortName: 'bap-two',
      name: 'bap-recipe-two',
      potentialExclusions: [noCheese],
    };

    const recipeEleven: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls-two',
      name: 'balls-recipe-two',
      potentialExclusions: [noTuna],
    };

    const recipeTwelve: Recipe = {
      id: '8',
      hotOrCold: HotOrCold.Hot,
      shortName: 'balls-two',
      name: 'balls-recipe-two',
      potentialExclusions: [],
    };
    const mockCustomer1 = mock<CustomerWithChargebeePlan>();
    mockCustomer1.exclusions = [noCheese];

    const mockCustomer2 = mock<CustomerWithChargebeePlan>();
    mockCustomer2.exclusions = [noCheese, noTuna];

    const mockCustomer3 = mock<CustomerWithChargebeePlan>();
    mockCustomer3.exclusions = [];

    const selection = [
      {
        customer: mockCustomer1,
        deliveries: [[], []],
      },
      {
        customer: mockCustomer2,
        deliveries: [
          [],
          [
            {
              chosenVariant: 'Breakfast',
            },
          ],
        ],
      },
      {
        customer: mockCustomer3,
        deliveries: [
          [
            {
              chosenVariant: 'Breakfast',
            },
          ],
          [
            {
              chosenVariant: 'Breakfast',
            },
          ],
        ],
      },
    ];

    const [dayOne, dayTwo] = makeCookPlan(selection, [
      recipeOne,
      recipeTwo,
      recipeThree,
      recipeFour,
      recipeFive,
      recipeSix,
      recipeSeven,
      recipeEight,
      recipeNine,
      recipeTen,
      recipeEleven,
      recipeTwelve,
    ]);

    expect(dayOne.get('Breakfast')?.['Breakfast'].count).toEqual(1);
    expect(dayOne.get('Breakfast')?.['Breakfast'].customers).toEqual([
      mockCustomer3,
    ]);
    expect(dayTwo.get('Breakfast')?.['Breakfast'].count).toEqual(2);
  });
});
