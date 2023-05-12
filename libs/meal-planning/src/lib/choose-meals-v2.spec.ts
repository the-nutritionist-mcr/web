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
  numberOfBags: 1,
  salutation: 'Mr',
  groups: [],
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
      id: '3',
      name: 'Equilibrium',
      subscriptionStatus: 'active',
      daysPerWeek: 6,
      termEnd: 123_123,
      itemsPerDay: 5,
      isExtra: false,
      totalMeals: 30,
    },
  ],
  customisations: [],
};

const customerTwo: BackendCustomer = {
  numberOfBags: 1,
  salutation: 'mr',
  addressLine1: 'somewhere',
  addressLine2: 'somehow',
  addressLine3: 'someplace',
  groups: [],
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
      id: '5',
      name: 'Mass',
      daysPerWeek: 1,
      itemsPerDay: 5,
      isExtra: false,
      termEnd: 123_123,
      totalMeals: 5,
      subscriptionStatus: 'active',
    },
    {
      id: '6',
      name: 'Equilibrium',
      daysPerWeek: 1,
      itemsPerDay: 5,
      isExtra: false,
      termEnd: 123_123,
      totalMeals: 5,
      subscriptionStatus: 'active',
    },
  ],
  customPlan: [],
  customisations: [],
};

const customerThree: BackendCustomer = {
  customisations: [],
  numberOfBags: 1,
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
  groups: [],
  surname: 'bash',
  email: 'baz-email',
  plans: [
    {
      id: '0',
      name: 'Equilibrium',
      daysPerWeek: 6,
      itemsPerDay: 2,
      termEnd: 123_123,
      isExtra: false,
      totalMeals: 12,
      subscriptionStatus: 'active',
    },
    {
      id: '1',
      name: 'Micro',
      daysPerWeek: 6,
      itemsPerDay: 2,
      termEnd: 123_123,
      isExtra: false,
      totalMeals: 12,
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
  it('generates a selection for each customer', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    expect(result).toBeDefined();
    expect(result.customerPlans[0].customer).toEqual(customerOne);
    expect(result.customerPlans[1].customer).toEqual(customerTwo);
    expect(result.customerPlans[2].customer).toEqual(customerThree);
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
    if (!result.customerPlans[0].deliveries[0].paused) {
      expect(result.customerPlans[0].deliveries[0].plans).toHaveLength(1);
    }
    if (!result.customerPlans[0].deliveries[1].paused) {
      expect(result.customerPlans[0].deliveries[1].plans).toHaveLength(1);
    }
    if (!result.customerPlans[1].deliveries[0].paused) {
      expect(result.customerPlans[1].deliveries[0].plans).toHaveLength(2);
    }
    if (!result.customerPlans[1].deliveries[1].paused) {
      expect(result.customerPlans[1].deliveries[1].plans).toHaveLength(2);
    }
    if (!result.customerPlans[2].deliveries[0].paused) {
      expect(result.customerPlans[2].deliveries[0].plans).toHaveLength(2);
    }
    if (!result.customerPlans[2].deliveries[1].paused) {
      expect(result.customerPlans[2].deliveries[1].plans).toHaveLength(2);
    }
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
    if (!result.customerPlans[0].deliveries[0].paused) {
      expect(result.customerPlans[0].deliveries[0].plans[0].status).toBe(
        'active'
      );
    }

    if (!result.customerPlans[1].deliveries[0].paused) {
      expect(result.customerPlans[1].deliveries[0].plans[1].status).toBe(
        'paused'
      );
    }

    if (!result.customerPlans[1].deliveries[0].paused) {
      expect(result.customerPlans[1].deliveries[0].plans[0].status).toBe(
        'active'
      );
    }

    if (!result.customerPlans[2].deliveries[0].paused) {
      expect(result.customerPlans[2].deliveries[0].plans[0].status).toBe(
        'active'
      );
    }
  });

  it('Generates a plan in each delivery for the customer plans', () => {
    const customers: BackendCustomer[] = [
      customerOne,
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(dummyPlannedCooks, customers, 'me');

    if (!result.customerPlans[0].deliveries[0].paused) {
      expect(result).toBeDefined();
      const firstPlan = result.customerPlans[0].deliveries[0].plans[0];

      if (firstPlan.status === 'active') {
        expect(firstPlan.meals).toHaveLength(15);
        expect(firstPlan.meals[0].isExtra).toBeFalsy();

        if (firstPlan.meals[0].isExtra === false) {
          expect(firstPlan.meals[0].recipe).toBe(recipeOne);
          expect(firstPlan.name).toBe('Equilibrium');
        }

        expect(firstPlan.meals[6].isExtra).toBeFalsy();
        if (firstPlan.meals[6].isExtra === false) {
          expect(firstPlan.meals[6].recipe).toBe(recipeOne);
        }
      }
    }

    if (!result.customerPlans[1].deliveries[0].paused) {
      const secondPlan = result.customerPlans[1].deliveries[0].plans[1];
      if (secondPlan.status === 'active') {
        expect(secondPlan.meals).toHaveLength(5);
      }
    }
  });

  it('When there is multiple plans, the picking algorithm does not start again for the second plan', () => {
    const notSixPlannedCooks: Cook[] = [
      {
        date: new Date(),
        menu: [recipeOne, recipeTwo, recipeThree, recipeFour],
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
      customerTwo,
      customerThree,
    ];
    const result = chooseMealSelections(notSixPlannedCooks, customers, 'me');

    if (!result.customerPlans[2].deliveries[0].paused) {
      const secondPlan = result.customerPlans[2].deliveries[0].plans[1];

      if (secondPlan.status === 'active' && !secondPlan.meals[0].isExtra) {
        expect(secondPlan.meals[0].recipe).toBe(recipeTwo);
      }
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
    if (!result.customerPlans[2].deliveries[1].paused) {
      const lastPlan = result.customerPlans[2].deliveries[1].plans[0];

      if (lastPlan.status === 'active') {
        expect(lastPlan.meals).toHaveLength(55);
      }
    }
  });

  it("actually adds custom plans if the original plan wasn't there", () => {
    const customerData = JSON.parse(`[
  {
    "id": "asdasd",
    "username": "asdasd",
    "salutation": "",
    "country": "",
    "deliveryDay1": "",
    "deliveryDay2": "",
    "customPlan": [
      {
        "items": [
          {
            "name": "Equilibrium",
            "quantity": 1,
            "isExtra": false
          },
          {
            "name": "Mass",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Micro",
            "quantity": 5,
            "isExtra": false
          },
          {
            "name": "Ultra Micro",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Low-CHO",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Seasonal Soup",
            "quantity": 0,
            "isExtra": true
          },
          {
            "name": "Breakfast",
            "quantity": 3,
            "isExtra": true
          },
          {
            "name": "Snacks",
            "quantity": 0,
            "isExtra": true
          }
        ],
        "extras": []
      },
      {
        "items": [
          {
            "name": "Equilibrium",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Mass",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Micro",
            "quantity": 4,
            "isExtra": false
          },
          {
            "name": "Ultra Micro",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Low-CHO",
            "quantity": 0,
            "isExtra": false
          },
          {
            "name": "Seasonal Soup",
            "quantity": 0,
            "isExtra": true
          },
          {
            "name": "Breakfast",
            "quantity": 4,
            "isExtra": true
          },
          {
            "name": "Snacks",
            "quantity": 0,
            "isExtra": true
          }
        ],
        "extras": []
      }
    ],
    "customisations": [],
    "deliveryDay3": "",
    "subscriptionUpdateTime": "1660997491.211",
    "firstName": "Ben",
    "city": "",
    "postcode": "",
    "plans": [
      {
        "name": "Breakfast",
        "daysPerWeek": 7,
        "itemsPerDay": 1,
        "termEnd": 1663675881000,
        "subscriptionStatus": "active",
        "isExtra": true,
        "totalMeals": 7
      },
      {
        "name": "Micro",
        "daysPerWeek": 7,
        "itemsPerDay": 1,
        "termEnd": 1663399561000,
        "subscriptionStatus": "active",
        "isExtra": false,
        "totalMeals": 7
      }
    ],
    "customerUpdateTime": "1660721155.764",
    "addressLine1": "",
    "addressLine2": "",
    "surname": "Wainwright",
    "email": "ben+testnewinfr@thenutritionistmcr.com",
    "addressLine3": "",
    "phoneNumber": "+447872591841"
  },
  {
    "id": "cypress-test-user-two",
    "username": "cypress-test-user-two",
    "salutation": "",
    "country": "",
    "deliveryDay1": "",
    "deliveryDay2": "",
    "customisations": [],
    "deliveryDay3": "",
    "subscriptionUpdateTime": "",
    "firstName": "Cypress",
    "city": "",
    "postcode": "",
    "plans": [],
    "customerUpdateTime": "",
    "addressLine1": "",
    "addressLine2": "",
    "surname": "Tester2",
    "email": "cypress2@test.com",
    "addressLine3": "",
    "phoneNumber": ""
  },
  {
    "id": "cypress-test-user",
    "username": "cypress-test-user",
    "salutation": "",
    "country": "",
    "deliveryDay1": "",
    "deliveryDay2": "",
    "customisations": [],
    "deliveryDay3": "",
    "subscriptionUpdateTime": "",
    "firstName": "Cypress",
    "city": "",
    "postcode": "",
    "plans": [],
    "customerUpdateTime": "",
    "addressLine1": "",
    "addressLine2": "",
    "surname": "Tester",
    "email": "cypress@test.com",
    "addressLine3": "",
    "phoneNumber": ""
  },
  {
    "id": "test-customer-1",
    "username": "test-customer-1",
    "salutation": "",
    "country": "",
    "deliveryDay1": "Monday",
    "deliveryDay2": "Wednesday",
    "customisations": [],
    "deliveryDay3": "",
    "subscriptionUpdateTime": "",
    "firstName": "Ben (test customer)",
    "city": "",
    "postcode": "",
    "plans": [
      {
        "name": "Equilibrium",
        "daysPerWeek": 6,
        "itemsPerDay": 1,
        "isExtra": false,
        "totalMeals": 6
      },
      {
        "name": "Breakfast",
        "daysPerWeek": 7,
        "itemsPerDay": 1,
        "isExtra": true,
        "totalMeals": 7
      }
    ],
    "customerUpdateTime": "",
    "addressLine1": "",
    "addressLine2": "",
    "surname": "Wainwright",
    "email": "ben+testcustomer@thenutritionistmcr.com",
    "addressLine3": "",
    "phoneNumber": ""
  },
  {
    "id": "test-webhook-ben",
    "username": "test-webhook-ben",
    "salutation": "",
    "country": "",
    "deliveryDay1": "Monday",
    "deliveryDay2": "Thursday",
    "customisations": [],
    "deliveryDay3": "Saturday",
    "subscriptionUpdateTime": "",
    "firstName": "Ben",
    "city": "",
    "postcode": "",
    "plans": [],
    "customerUpdateTime": "1660719494.679",
    "addressLine1": "",
    "addressLine2": "",
    "surname": "Wainwright",
    "email": "ben+testwebhook@thenutritionistmcr.com",
    "addressLine3": "",
    "phoneNumber": "+447872591841"
  }
]`);

    const cooks = JSON.parse(`[
  {
    "date": "2022-08-07T23:00:00.000Z",
    "menu": [
      {
        "hotOrCold": "Hot",
        "shortName": "test",
        "potentialExclusions": [
          {
            "name": "test",
            "allergen": true,
            "id": "4f7030df-6b0a-40c5-8c66-729c17a19dc7"
          }
        ],
        "allergens": "test",
        "invalidExclusions": [
          "4f7030df-6b0a-40c5-8c66-729c17a19dc7"
        ],
        "description": "test",
        "id": "09912018-6552-4d2f-b56d-31f2ebff0ab1",
        "name": "test"
      },
      {
        "hotOrCold": "Cold",
        "shortName": "Testthing",
        "alternates": [],
        "potentialExclusions": [],
        "allergens": "test",
        "invalidExclusions": [],
        "description": "test",
        "id": "1288283c-c332-4ad0-a837-a476b7c21f48",
        "name": "testOther"
      }
    ]
  },
  {
    "date": "2022-08-04T23:00:00.000Z",
    "menu": [
      {
        "hotOrCold": "Hot",
        "shortName": "test",
        "potentialExclusions": [
          {
            "name": "test",
            "allergen": true,
            "id": "4f7030df-6b0a-40c5-8c66-729c17a19dc7"
          }
        ],
        "allergens": "test",
        "invalidExclusions": [
          "4f7030df-6b0a-40c5-8c66-729c17a19dc7"
        ],
        "description": "test",
        "id": "09912018-6552-4d2f-b56d-31f2ebff0ab1",
        "name": "test"
      },
      {
        "hotOrCold": "Cold",
        "shortName": "Testthing",
        "alternates": [],
        "potentialExclusions": [],
        "allergens": "test",
        "invalidExclusions": [],
        "description": "test",
        "id": "1288283c-c332-4ad0-a837-a476b7c21f48",
        "name": "testOther"
      }
    ]
  }
]`);

    const result = chooseMealSelections(cooks, customerData, 'me');

    const customerWithPlans = result.customerPlans.find(
      (item) => item.customer.username === 'asdasd'
    );

    expect(customerWithPlans).toBeDefined();

    if (customerWithPlans && !customerWithPlans.deliveries[0].paused) {
      expect(customerWithPlans?.deliveries[0].plans).toHaveLength(3);
      expect(customerWithPlans?.deliveries[0].plans[0].name).toEqual(
        'Breakfast'
      );
      expect(customerWithPlans?.deliveries[0].plans[1].name).toEqual('Micro');
      expect(customerWithPlans?.deliveries[0].plans[2].name).toEqual(
        'Equilibrium'
      );

      const customPlan = customerWithPlans?.deliveries[0].plans[2];
      expect(customPlan?.status).toEqual('active');
      if (customPlan?.status === 'active') {
        expect(customPlan.meals).toHaveLength(1);
      }
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

    if (!result.customerPlans[1].deliveries[0].paused) {
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
    }
  });
});
