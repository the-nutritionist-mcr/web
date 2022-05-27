import {
  DeliveryMealsSelection,
  Recipe,
  HotOrCold,
  CustomerWithChargebeePlan,
} from '@tnmw/types';
import { chooseMeals } from './choose-meals';

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
  potentialExclusions: [],
};

const recipeFour: Recipe = {
  id: '5',
  hotOrCold: HotOrCold.Hot,
  shortName: 'bap',
  name: 'bap-recipe',
  potentialExclusions: [],
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
  potentialExclusions: [],
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
  potentialExclusions: [],
};

const recipeEleven: Recipe = {
  id: '8',
  hotOrCold: HotOrCold.Hot,
  shortName: 'balls-two',
  name: 'balls-recipe-two',
  potentialExclusions: [],
};

const recipeTwelve: Recipe = {
  id: '8',
  hotOrCold: HotOrCold.Hot,
  shortName: 'balls-two',
  name: 'balls-recipe-two',
  potentialExclusions: [],
};

const customerOne: CustomerWithChargebeePlan = {
  telephone: '123123',
  id: '1',
  salutation: 'Mr',
  address: 'somewhere',
  firstName: 'Ben',
  surname: 'Wainwright',
  email: 'foo-email',
  chargebeePlan: [
    {
      name: 'Equilibrium',
      daysPerWeek: 6,
      itemsPerDay: 5,
      isExtra: false,
      totalMeals: 30,
    },
  ],
  newPlan: {
    deliveries: [
      {
        items: [
          { name: 'Equilibrium', quantity: 5 },
          { name: 'Mass', quantity: 3 },
        ],
        extras: [],
      },
      {
        items: [
          { name: 'Equilibrium', quantity: 3 },
          { name: 'Mass', quantity: 5 },
        ],
        extras: [],
      },
    ],
  },
  exclusions: [],
};

const customerTwo: CustomerWithChargebeePlan = {
  id: '2',
  salutation: 'mr',
  address: 'Somewhere',
  telephone: '023',
  firstName: 'bar-customer',
  surname: 'baz',
  email: 'bar-email',
  chargebeePlan: [
    {
      name: 'Mass',
      daysPerWeek: 1,
      itemsPerDay: 5,
      isExtra: false,
      totalMeals: 5,
    },
  ],
  newPlan: {
    deliveries: [
      {
        items: [
          { name: 'Equilibrium', quantity: 5 },
          { name: 'Micro', quantity: 5 },
        ],
        extras: [{ name: 'Breakfast', quantity: 5 }],
      },
      {
        items: [
          { name: 'Equilibrium', quantity: 5 },
          { name: 'Mass', quantity: 5 },
        ],
        extras: [{ name: 'Breakfast', quantity: 5 }],
      },
    ],
  },
  exclusions: [],
};

const customerThree: CustomerWithChargebeePlan = {
  exclusions: [],
  id: '3',
  salutation: 'Mr',
  address: 'Foobar',
  telephone: '123',
  firstName: 'baz-customer',
  surname: 'bash',
  email: 'baz-email',
  chargebeePlan: [
    {
      name: 'Mass',
      daysPerWeek: 6,
      itemsPerDay: 2,
      isExtra: false,
      totalMeals: 30,
    },
  ],
  newPlan: {
    deliveries: [
      {
        items: [
          { name: 'Equilibrium', quantity: 5 },
          { name: 'Micro', quantity: 4 },
        ],
        extras: [{ name: 'Breakfast', quantity: 5 }],
      },
      {
        items: [
          { name: 'Equilibrium', quantity: 5 },
          { name: 'Mass', quantity: 5 },
        ],
        extras: [{ name: 'Large Snack', quantity: 4 }],
      },
    ],
  },
};

describe('Choose Meals', () => {
  it('ignores inactive customers', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    expect(result[0].customer).toBe(customerOne);
    expect(result[1].customer).toBe(customerTwo);
    expect(result[2].customer).toBe(customerThree);
  });

  it('generates a selection for each customer', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const inActiveCustomerTwo = {
      ...customerTwo,
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),

      // Oct 05 2036
      pauseEnd: new Date(2_106_780_800_000).toISOString(),
    };

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      inActiveCustomerTwo,
      customerThree,
    ];
    const dates = [new Date(1_582_922_930_000), new Date(1_588_103_330_000)];
    const result = chooseMeals(selection, dates, customers);

    expect(result).toHaveLength(3);
    expect(result[0].customer).toBe(customerOne);
    expect(result[1].customer).toBe(inActiveCustomerTwo);
    expect(result[1].deliveries[0]).not.toBeFalsy();
    expect(result[1].deliveries[1]).toEqual('Paused until Oct 5th');
    expect(result[2].customer).toBe(customerThree);
  });

  it('generates a selection containing the correct number of each main meal in each delivery', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    expect(
      Array.isArray(result[0].deliveries[0]) && result[0].deliveries[0]
    ).toHaveLength(8);
    expect(
      Array.isArray(result[0].deliveries[1]) && result[0].deliveries[1]
    ).toHaveLength(8);
    expect(result[1].deliveries[1]).toHaveLength(15);
    expect(result[1].deliveries[1]).toHaveLength(15);
    expect(result[2].deliveries[0]).toHaveLength(14);
    expect(result[2].deliveries[1]).toHaveLength(14);
  });

  it('generates a selection containing the correct recipes in any given position', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    expect(
      Array.isArray(result[0].deliveries[0]) && result[0].deliveries[0][0]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeOne,
    });
    expect(
      Array.isArray(result[0].deliveries[0]) && result[0].deliveries[0][3]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeFour,
    });
    expect(
      Array.isArray(result[0].deliveries[0]) && result[0].deliveries[0][7]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeTwo,
    });
    expect(
      Array.isArray(result[0].deliveries[1]) && result[0].deliveries[1][0]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeSeven,
    });
    expect(
      Array.isArray(result[0].deliveries[1]) && result[0].deliveries[1][2]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeNine,
    });
    expect(
      Array.isArray(result[0].deliveries[1]) && result[0].deliveries[1][6]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeSeven,
    });
  });

  it('generates a selection with the right variant in each position', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    const variants =
      Array.isArray(result[0].deliveries[0]) &&
      result[0].deliveries[0].map((item) => item.chosenVariant);
    expect(variants).toEqual([
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Mass',
      'Mass',
      'Mass',
    ]);

    const variants2 =
      Array.isArray(result[2].deliveries[1]) &&
      result[2].deliveries[1].map((item) => item.chosenVariant);
    expect(variants2).toEqual([
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Equilibrium',
      'Mass',
      'Mass',
      'Mass',
      'Mass',
      'Mass',
      'Large Snack',
      'Large Snack',
      'Large Snack',
      'Large Snack',
    ]);
  });

  it('Where a recipe is tagged with a particular customisation as an exclusion, skips that meal if the customer has that customisation selected', () => {
    const customerTwoWithExclusion = {
      ...customerTwo,

      exclusions: [
        {
          id: '423',
          name: 'foo',
          allergen: false,
        },
      ],
    };

    const recipeTwoWithExclusion = {
      ...recipeTwo,
      invalidExclusions: ['423'],
    };

    const selection: DeliveryMealsSelection[] = [
      [
        recipeOne,
        recipeTwoWithExclusion,
        recipeThree,
        recipeFour,
        recipeFive,
        recipeSix,
      ],
      [
        recipeSeven,
        recipeEight,
        recipeNine,
        recipeTen,
        recipeEleven,
        recipeTwelve,
      ],
    ];

    const customers: CustomerWithChargebeePlan[] = [
      customerOne,
      customerTwoWithExclusion,
      customerThree,
    ];
    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    const foundExcludedMeal = result[1].deliveries.find((delivery) =>
      typeof delivery !== 'string'
        ? delivery.find((item) =>
            'recipe' in item ? item.recipe === recipeTwoWithExclusion : false
          )
        : false
    );

    expect(foundExcludedMeal).toBeFalsy();
  });

  it('Does not plan the same meals to customer that are next to each other when they have less than six meals on their plan', () => {
    const selection: DeliveryMealsSelection[] = [
      [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
    ];

    const sparseCustomerOne: CustomerWithChargebeePlan = {
      ...customerOne,

      newPlan: {
        deliveries: [
          {
            items: [{ name: 'Equilibrium', quantity: 2 }],
            extras: [],
          },
        ],
      },
    };

    const sparseCustomerTwo: CustomerWithChargebeePlan = {
      ...customerTwo,

      newPlan: {
        deliveries: [
          {
            items: [{ name: 'Equilibrium', quantity: 2 }],
            extras: [],
          },
        ],
      },
    };

    const customers: CustomerWithChargebeePlan[] = [
      sparseCustomerOne,
      sparseCustomerTwo,
    ];

    const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
    const result = chooseMeals(selection, dates, customers);

    expect(
      Array.isArray(result[1].deliveries[0]) && result[1].deliveries[0][0]
    ).toEqual({
      chosenVariant: expect.anything(),
      recipe: recipeThree,
    });
  });
});
