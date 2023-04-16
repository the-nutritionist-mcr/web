import { Delivery } from '@tnmw/types';
import { hydrateCustomPlan } from './hydrate-custom-plan';
describe('hydrate custom plan', () => {
  it('marks extras when they are not present', () => {
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
        name: 'Snacks',
        isExtra: true,
      },
    ];
    const delivery: Delivery[] = [
      {
        items: [
          {
            name: 'Equilibrium',
            quantity: 2,
          },
          {
            name: 'Mass',
            quantity: 0,
          },
          {
            name: 'Micro',
            quantity: 0,
          },
          {
            name: 'Ultra Micro',
            quantity: 0,
          },
          {
            name: 'Low-CHO',
            quantity: 0,
          },
          {
            name: 'Seasonal Soup',
            quantity: 0,
          },
          {
            name: 'Breakfast',
            quantity: 1,
          },
          {
            name: 'Snacks',
            quantity: 0,
          },
        ],
        extras: [],
      },
      {
        items: [
          {
            name: 'Equilibrium',
            quantity: 2,
          },
          {
            name: 'Mass',
            quantity: 0,
          },
          {
            name: 'Micro',
            quantity: 0,
          },
          {
            name: 'Ultra Micro',
            quantity: 0,
          },
          {
            name: 'Low-CHO',
            quantity: 0,
          },
          {
            name: 'Seasonal Soup',
            quantity: 0,
          },
          {
            name: 'Breakfast',
            quantity: 1,
          },
          {
            name: 'Snacks',
            quantity: 0,
          },
        ],
        extras: [],
      },
    ];

    const result = hydrateCustomPlan(delivery, families);

    expect(result).toBeDefined();
    if (result) {
      expect(result[0].items[0].isExtra).toEqual(false);
      expect(result[1].items[3].isExtra).toEqual(false);
    }
  });
});
