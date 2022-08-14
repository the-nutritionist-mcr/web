import {
  DeliveryMealsSelection,
  Recipe,
  HotOrCold,
  BackendCustomer,
} from '@tnmw/types';
import { chooseMealSelections, Cook } from './choose-meals-v2';
import { getCookStatus } from './get-cook-status';
import { when } from 'jest-when';

jest.mock('./get-cook-status');

beforeEach(() => {
  jest.useRealTimers();
  jest.mocked(getCookStatus).mockReturnValue({ status: 'active' });
});

const date = (day: number, month: number, year: number) => {
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
};

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

const customerOne: BackendCustomer = {
  phoneNumber: '123123',
  salutation: 'Mr',
  addressLine1: 'somewhere',
  addressLine2: 'somehow',
  addressLine3: 'someplace',
  firstName: 'Ben',
  surname: 'Wainwright',
  email: 'foo-email',

  country: 'GB',
  username: 'person',
  deliveryDay1: 'Monday',
  deliveryDay2: 'Tuesday',
  customerUpdateTime: '1234567810',
  subscriptionUpdateTime: '1233456',
  city: 'Manchester',
  postcode: 'M4 7AL',
  deliveryDay3: 'Wednesday',
  plans: [
    {
      name: 'Equilibrium',
      subscriptionStatus: 'active',
      daysPerWeek: 6,
      termEnd: 123123,
      itemsPerDay: 5,
      isExtra: false,
      totalMeals: 30,
    },
  ],
  customisations: [],
};

const customerTwo: BackendCustomer = {
  salutation: 'mr',
  addressLine1: 'somewhere',
  addressLine2: 'somehow',
  addressLine3: 'someplace',
  phoneNumber: '023',
  firstName: 'bar-customer',
  surname: 'baz',
  email: 'bar-email',

  country: 'GB',
  username: 'person',
  deliveryDay1: 'Monday',
  deliveryDay2: 'Tuesday',
  customerUpdateTime: '1234567810',
  subscriptionUpdateTime: '1233456',
  city: 'Manchester',
  postcode: 'M4 7AL',
  deliveryDay3: 'Wednesday',
  plans: [
    {
      name: 'Mass',
      daysPerWeek: 1,
      itemsPerDay: 5,
      isExtra: false,
      termEnd: 123123,
      totalMeals: 5,
      subscriptionStatus: 'active',
    },
    {
      name: 'Equilibrium',
      daysPerWeek: 1,
      itemsPerDay: 5,
      isExtra: false,
      termEnd: 123123,
      totalMeals: 5,
      subscriptionStatus: 'active',
    },
  ],
  customPlan: [],
  customisations: [],
};

const customerThree: BackendCustomer = {
  customisations: [],
  salutation: 'Mr',
  country: 'GB',
  username: 'person',
  addressLine1: 'somewhere',
  deliveryDay1: 'Monday',
  deliveryDay2: 'Tuesday',
  customerUpdateTime: '1234567810',
  subscriptionUpdateTime: '1233456',
  city: 'Manchester',
  postcode: 'M4 7AL',
  deliveryDay3: 'Wednesday',
  addressLine2: 'somehow',
  addressLine3: 'someplace',
  phoneNumber: '123',
  firstName: 'baz-customer',
  surname: 'bash',
  email: 'baz-email',
  plans: [
    {
      name: 'Equilibrium',
      daysPerWeek: 6,
      itemsPerDay: 2,
      termEnd: 123123,
      isExtra: false,
      totalMeals: 30,
      subscriptionStatus: 'active',
    },
    {
      name: 'Micro',
      daysPerWeek: 6,
      itemsPerDay: 2,
      termEnd: 123123,
      isExtra: false,
      totalMeals: 30,
      subscriptionStatus: 'active',
    },
  ],
  customPlan: [
    {
      items: [
        { name: 'Equilibrium', quantity: 5 },
        { name: 'Micro', quantity: 4 },
      ],
      extras: [],
    },
    {
      items: [
        { name: 'Equilibrium', quantity: 55 },
        { name: 'Micro', quantity: 5 },
      ],
      extras: [],
    },
  ],
};

const dummyPlannedCooks: Cook[] = [
  {
    date: new Date(),
    menu: [
      recipeOne,
      recipeTwo,
      recipeThree,
      recipeFour,
      recipeFive,
      recipeSix,
    ],
  },

  {
    date: new Date(),
    menu: [
      recipeSeven,
      recipeEight,
      recipeNine,
      recipeTen,
      recipeEleven,
      recipeTwelve,
    ],
  },
];

describe('Choose Meals', () => {
  // it('ignores inactive customers', () => {
  //   const selection: DeliveryMealsSelection[] = [
  //     [recipeOne, recipeTwo, recipeThree, recipeFour, recipeFive, recipeSix],
  //     [
  //       recipeSeven,
  //       recipeEight,
  //       recipeNine,
  //       recipeTen,
  //       recipeEleven,
  //       recipeTwelve,
  //     ],
  //   ];

  //   const customers: BackendCustomer[] = [
  //     customerOne,
  //     customerTwo,
  //     customerThree,
  //   ];
  //   const dates = [new Date(1_630_702_130_000), new Date(1_630_702_130_000)];
  //   const result = chooseMealSelections(selection, dates, customers);

  //   expect(result[0].customer).toBe(customerOne);
  //   expect(result[1].customer).toBe(customerTwo);
  //   expect(result[2].customer).toBe(customerThree);
  // });

  it('generates a selection for each customer', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].customer).toBe(customerOne);
    expect(result.customerPlans[1].customer).toBe(customerTwo);
    expect(result.customerPlans[2].customer).toBe(customerThree);
  });

  it('adds the correct date to the plan', () => {
    const theDate = date(14, 11, 22);

    jest.useFakeTimers();
    jest.setSystemTime(theDate);

    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];

    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result.createdOn).toEqual(theDate);
  });

  it('returns the cook and createdBy exactly as is', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];

    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.cooks).toStrictEqual(dummyPlannedCooks);
    expect(result.createdBy).toStrictEqual('me');
  });

  it('returns the cooks exactly as is', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.cooks).toStrictEqual(dummyPlannedCooks);
  });

  it('plan was not updated by customer', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].wasUpdatedByCustomer).toBeFalsy();
    expect(result.customerPlans[1].wasUpdatedByCustomer).toBeFalsy();
    expect(result.customerPlans[2].wasUpdatedByCustomer).toBeFalsy();
  });

  it('customers get a delivery for each cook', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].deliveries).toHaveLength(2);
    expect(result.customerPlans[1].deliveries).toHaveLength(2);
    expect(result.customerPlans[2].deliveries).toHaveLength(2);
  });

  it('Generates a plan in each delivery for the customer plans', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].deliveries[0].plans).toHaveLength(1);
    expect(result.customerPlans[0].deliveries[1].plans).toHaveLength(1);
    expect(result.customerPlans[1].deliveries[0].plans).toHaveLength(2);
    expect(result.customerPlans[1].deliveries[1].plans).toHaveLength(2);
    expect(result.customerPlans[2].deliveries[0].plans).toHaveLength(2);
    expect(result.customerPlans[2].deliveries[1].plans).toHaveLength(2);
  });

  it('Inserts the status based on the cook date and the plan details', () => {
    when(jest.mocked(getCookStatus))
      .calledWith(dummyPlannedCooks[0].date, customerTwo.plans[1])
      .mockReturnValue({ status: 'paused' });

    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].deliveries[0].plans[0].status).toBe(
      'active'
    );

    expect(result.customerPlans[1].deliveries[0].plans[1].status).toBe(
      'paused'
    );

    expect(result.customerPlans[1].deliveries[0].plans[0].status).toBe(
      'active'
    );
    expect(result.customerPlans[2].deliveries[0].plans[0].status).toBe(
      'active'
    );
  });

  it('Generates a plan in each delivery for the customer plans', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    const firstPlan = result.customerPlans[0].deliveries[0].plans[0];
    if (firstPlan.status === 'active') {
      expect(firstPlan.meals).toHaveLength(15);
      expect(firstPlan.meals[0].isExtra).toBeFalsy();
      if (firstPlan.meals[0].isExtra === false) {
        expect(firstPlan.meals[0].recipe).toBe(recipeOne);
        expect(firstPlan.meals[0].chosenVariant).toBe('Equilibrium');
      }
      expect(firstPlan.meals[6].isExtra).toBeFalsy();
      if (firstPlan.meals[6].isExtra === false) {
        expect(firstPlan.meals[6].recipe).toBe(recipeOne);
      }
    }

    const secondPlan = result.customerPlans[1].deliveries[0].plans[1];
    if (secondPlan.status === 'active') {
      expect(secondPlan.meals).toHaveLength(5);
    }
  });

  it('Gets overriden by custom plans', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    const lastPlan = result.customerPlans[2].deliveries[1].plans[0];

    if (lastPlan.status === 'active') {
      expect(lastPlan.meals).toHaveLength(55);
    }
  });

  it('Skips exclusions', () => {
    const customerTwoWithExclusion = {
      ...customerTwo,

      customisations: [
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

    const plannedCooks: Cook[] = [
      {
        date: new Date(),
        menu: [
          recipeOne,
          recipeTwoWithExclusion,
          recipeThree,
          recipeFour,
          recipeFive,
          recipeSix,
        ],
      },

      {
        date: new Date(),
        menu: [
          recipeSeven,
          recipeEight,
          recipeNine,
          recipeTen,
          recipeEleven,
          recipeTwelve,
        ],
      },
    ];

    const customers: BackendCustomer[] = [
      customerOne,
      customerTwoWithExclusion,
      customerThree,
    ];
    const result = chooseMealSelections(plannedCooks, customers, 'me');

    expect(result).toBeDefined();

    const secondPlan = result.customerPlans[1].deliveries[0].plans[0];
    expect(secondPlan.status).toBe('active');

    if (secondPlan.status === 'active') {
      const foundRecipeTwo = secondPlan.meals.find(
        (meal) => !meal.isExtra && meal.recipe === recipeTwoWithExclusion
      );
      expect(foundRecipeTwo).toBeFalsy();
    }

    const secondPlanMore = result.customerPlans[1].deliveries[0].plans[1];
    expect(secondPlanMore.status).toBe('active');

    if (secondPlanMore.status === 'active') {
      const foundRecipeTwo = secondPlanMore.meals.find(
        (meal) => !meal.isExtra && meal.recipe === recipeTwoWithExclusion
      );
      expect(foundRecipeTwo).toBeFalsy();
    }
  });
});
