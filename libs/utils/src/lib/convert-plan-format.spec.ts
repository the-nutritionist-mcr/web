import { StandardPlan } from '@tnmw/types';
import { convertPlanFormat } from './convert-plan-format';

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

    const result = convertPlanFormat(plan);

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
    expect(soupItems[2]?.isExtra).toBeTruthy();

    const microItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Micro')
    );
    expect(microItems[0]?.isExtra).toBeFalsy();
    expect(microItems[1]?.isExtra).toBeFalsy();
    expect(microItems[2]?.isExtra).toBeFalsy();
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

    const result = convertPlanFormat(plan);

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

    const result = convertPlanFormat(plan);

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

    const result = convertPlanFormat(plan);

    const microItems = result.deliveries.map((delivery) =>
      delivery.items.find((item) => item.name === 'Micro')
    );

    const totalMicroMeals = microItems.reduce(
      (total, meal) => (meal?.quantity ?? 0) + total,
      0
    );

    expect(totalMicroMeals).toEqual(26);
  });
});
