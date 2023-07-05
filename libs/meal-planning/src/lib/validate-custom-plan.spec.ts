import { BackendCustomer, Delivery, StandardPlan } from '@tnmw/types';
import { mock } from 'jest-mock-extended';
import { validateCustomPlan } from './validate-custom-plan';

describe('validate custom plan', () => {
  it('returns true if there is no custom plan', () => {
    const customer = mock<BackendCustomer>({
      customPlan: undefined,
    });

    const result = validateCustomPlan(customer);

    expect(result).toEqual(true);
  });

  it.only('returns true if the custom plan matches a single plan', () => {
    const plans: StandardPlan[] = [
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
    ];

    const customPlan: Delivery[] = [
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 3,
          },
          {
            name: 'Equilibrium',
            quantity: 4,
          },
        ],
      },
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 2,
          },
          {
            name: 'Equilibrium',
            quantity: 1,
          },
        ],
      },
    ];

    const customer = mock<BackendCustomer>({
      customPlan,
      plans,
    });

    const result = validateCustomPlan(customer);

    expect(result).toEqual(true);
  });

  it('returns false if the numbers do not match', () => {
    const plans: StandardPlan[] = [
      {
        id: '5',
        name: 'Mass',
        daysPerWeek: 2,
        itemsPerDay: 5,
        isExtra: false,
        termEnd: 123_123,
        totalMeals: 10,
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
    ];

    const customPlan: Delivery[] = [
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 3,
          },
          {
            name: 'Equilibrium',
            quantity: 1,
          },
        ],
      },
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 3,
          },
          {
            name: 'Equilibrium',
            quantity: 4,
          },
        ],
      },
    ];

    const customer = mock<BackendCustomer>({
      customPlan,
      plans,
    });

    const result = validateCustomPlan(customer);

    expect(result).toEqual(false);
  });

  it('returns false if there is an extra actual plan', () => {
    const plans: StandardPlan[] = [
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
    ];

    const customPlan: Delivery[] = [
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 1,
          },
        ],
      },
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 4,
          },
        ],
      },
    ];

    const customer = mock<BackendCustomer>({
      customPlan,
      plans,
    });

    const result = validateCustomPlan(customer);

    expect(result).toEqual(false);
  });

  it('returns false if there is an extra custom plan', () => {
    const plans: StandardPlan[] = [
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
    ];

    const customPlan: Delivery[] = [
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 3,
          },
          {
            name: 'Equilibrium',
            quantity: 2,
          },
          {
            name: 'Micro',
            quantity: 5,
          },
        ],
      },
      {
        extras: [],
        items: [
          {
            name: 'Mass',
            quantity: 2,
          },
          {
            name: 'Equilibrium',
            quantity: 3,
          },
          {
            name: 'Micro',
            quantity: 3,
          },
        ],
      },
    ];

    const customer = mock<BackendCustomer>({
      customPlan,
      plans,
    });

    const result = validateCustomPlan(customer);

    expect(result).toEqual(false);
  });
});
