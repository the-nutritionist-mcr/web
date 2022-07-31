import { StandardPlan } from '@tnmw/types';
import { convertPlanFormat } from './convert-plan-format';

const families = [
  {
    name: 'Equilibrium',
    isExtra: false,
  },
  {
    name: 'Mass',
    isExtra: false,
  },
  {
    name: 'Micro',
    isExtra: false,
  },
  {
    name: 'Ultra Micro',
    isExtra: false,
  },
  {
    name: 'Low-CHO',
    isExtra: false,
  },
  {
    name: 'Seasonal Soup',
    isExtra: true,
  },
  {
    name: 'Breakfast',
    isExtra: true,
  },
  {
    name: 'Snack',
    isExtra: true,
  },
  {
    name: 'Large Snack',
    isExtra: true,
  },
];

describe('convert plan format', () => {
  it('correctly marks extras', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Breakfast',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: true,
        totalMeals: 18,
      },
      {
        name: 'Mass',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
      {
        name: 'Mass',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
      {
        name: 'Seasonal Soup',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: true,
        totalMeals: 18,
      },
      {
        name: 'Micro',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
    ];

    const result = convertPlanFormat(plan, families);

    const massItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Mass')
    );

    expect(massItems[0]?.isExtra).toBeFalsy();

    const breakfastItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Breakfast')
    );

    expect(breakfastItems[0]?.isExtra).toBeTruthy();

    const soupItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Seasonal Soup')
    );

    expect(soupItems[0]?.isExtra).toBeTruthy();
    expect(soupItems[1]?.isExtra).toBeTruthy();

    const microItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Micro')
    );
    expect(microItems[0]?.isExtra).toBeFalsy();
    expect(microItems[1]?.isExtra).toBeFalsy();
  });
  it('Has a single entry for plans that are counted once when there are multiple plans', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Mass',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
    ];

    const result = convertPlanFormat(plan, families);

    const massItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Mass')
    );

    const count = massItems.reduce(
      (count, item) => (item?.quantity ?? 0) + count,
      0
    );

    expect(count).toEqual(18);
  });

  it('Has a single entry for plans that are counted more than once when there are multiple plans', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Micro',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
      {
        name: 'Micro',
        daysPerWeek: 4,
        itemsPerDay: 2,
        isExtra: false,
        totalMeals: 8,
      },
      {
        name: 'Mass',
        daysPerWeek: 1,
        itemsPerDay: 3,
        isExtra: false,
        totalMeals: 18,
      },
    ];

    const result = convertPlanFormat(plan, families);

    const microItems = result.deliveries[0].items.filter(
      (item) => (item.name as string) === 'Micro'
    );

    expect(microItems).toHaveLength(1);
  });

  it('Combines duplicate plans correctly', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Micro',
        daysPerWeek: 3,
        itemsPerDay: 6,
        isExtra: false,
        totalMeals: 18,
      },
      {
        name: 'Micro',
        daysPerWeek: 4,
        itemsPerDay: 2,
        isExtra: false,
        totalMeals: 8,
      },
      {
        name: 'Mass',
        daysPerWeek: 1,
        itemsPerDay: 3,
        isExtra: false,
        totalMeals: 18,
      },
    ];

    const result = convertPlanFormat(plan, families);

    const microItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Micro')
    );

    const totalMicroMeals = microItems.reduce(
      (total, meal) => (meal?.quantity ?? 0) + total,
      0
    );

    expect(totalMicroMeals).toEqual(26);
  });

  it('should correctly add extras to the delivery plan', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Breakfast',
        daysPerWeek: 2,
        itemsPerDay: 1,
        isExtra: true,
        totalMeals: 2,
      },
      {
        name: 'Equilibrium',
        daysPerWeek: 7,
        itemsPerDay: 1,
        isExtra: false,
        totalMeals: 7,
      },
    ];
    const result = convertPlanFormat(plan, families);

    expect(result).toStrictEqual({
      deliveries: [
        {
          items: [
            {
              name: 'Equilibrium',
              quantity: 3,
              isExtra: false,
            },
            {
              name: 'Mass',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Micro',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Ultra Micro',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Low-CHO',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Seasonal Soup',
              quantity: 0,
              isExtra: true,
            },
            {
              name: 'Breakfast',
              quantity: 1,
              isExtra: true,
            },
            {
              name: 'Snack',
              quantity: 0,
              isExtra: true,
            },
            {
              name: 'Large Snack',
              quantity: 0,
              isExtra: true,
            },
          ],
          extras: [],
        },
        {
          items: [
            {
              name: 'Equilibrium',
              quantity: 4,
              isExtra: false,
            },
            {
              name: 'Mass',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Micro',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Ultra Micro',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Low-CHO',
              quantity: 0,
              isExtra: false,
            },
            {
              name: 'Seasonal Soup',
              quantity: 0,
              isExtra: true,
            },
            {
              name: 'Breakfast',
              isExtra: true,
              quantity: 1,
            },
            {
              name: 'Snack',
              quantity: 0,
              isExtra: true,
            },
            {
              name: 'Large Snack',
              quantity: 0,
              isExtra: true,
            },
          ],
          extras: [],
        },
      ],
      configuration: {},
    });
  });
});
