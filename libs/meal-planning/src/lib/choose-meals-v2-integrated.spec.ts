import { BackendCustomer, Cook, HotOrCold, Recipe } from '@tnmw/types';
import { chooseMealSelections } from './choose-meals-v2';

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

describe('choose meals v2', () => {
  it.only('correctly generates pause dates', () => {
    const dummyOtherPlannedCooks: Cook[] = [
      {
        date: new Date(1_681_599_600_000),
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
        date: new Date(1_681_858_800_000),
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
    const pausedCustomer: BackendCustomer = {
      salutation: 'mr',
      addressLine1: 'somewhere',
      numberOfBags: 1,
      addressLine2: 'somehow',
      addressLine3: 'someplace',
      groups: [],
      phoneNumber: '023',
      firstName: 'bar-customer-paused',
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
          isExtra: false,
          itemsPerDay: 1,
          name: 'Mass',
          subscriptionStatus: 'active',
          pauseStart: 1_679_871_600_000,
          termEnd: 1_679_957_999_000,
          id: '199FSyTKXnFkMkGa',
          totalMeals: 6,
          daysPerWeek: 6,
          pauseEnd: 1_682_031_600_000,
        },
      ],
      customPlan: [
        {
          items: [
            {
              name: 'Equilibrium',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Mass',
              isExtra: false,
              quantity: 3,
            },
            {
              name: 'Micro',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Ultra Micro',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Low-CHO',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Seasonal Soup',
              isExtra: true,
              quantity: 0,
            },
            {
              name: 'Breakfast',
              isExtra: true,
              quantity: 0,
            },
            {
              name: 'Snacks',
              isExtra: true,
              quantity: 0,
            },
          ],
          extras: [],
        },
        {
          items: [
            {
              name: 'Equilibrium',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Mass',
              isExtra: false,
              quantity: 3,
            },
            {
              name: 'Micro',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Ultra Micro',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Low-CHO',
              isExtra: false,
              quantity: 0,
            },
            {
              name: 'Seasonal Soup',
              isExtra: true,
              quantity: 0,
            },
            {
              name: 'Breakfast',
              isExtra: true,
              quantity: 0,
            },
            {
              name: 'Snacks',
              isExtra: true,
              quantity: 0,
            },
          ],
          extras: [],
        },
      ],
      customisations: [],
    };

    const customers: BackendCustomer[] = [pausedCustomer];

    const result = chooseMealSelections(
      dummyOtherPlannedCooks,
      customers,
      'me'
    );
    expect(result).toBeDefined();
    expect(result.customerPlans[0].deliveries[0].paused).toBeTruthy();
    if (result.customerPlans[0].deliveries[0].paused) {
      expect(result.customerPlans[0].deliveries[0].pausedFrom).toBeDefined();
      expect(result.customerPlans[0].deliveries[0].pausedUntil).toBeDefined();
    }
  });
});
