import { CustomerWithChargebeePlan, Snack } from '@tnmw/types';
import isActive from './is-active';

describe('isActive', () => {
  const oldDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    // 17th November 2020
    const dateNowStub = jest.fn(() => 1_605_635_814_000);
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    global.Date.now = oldDateNow;
  });

  it('Should return true if there is no pause start or end', () => {
    const customer: CustomerWithChargebeePlan = {
      address: '',
      telephone: '',
      salutation: '',
      firstName: '',
      surname: '',
      id: '0',
      email: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be active if there is a pause start date that is in the future', () => {
    const customer: CustomerWithChargebeePlan = {
      address: '',
      telephone: '',
      salutation: '',
      firstName: '',
      surname: '',
      id: '0',
      email: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      // 1st February 2021
      pauseStart: new Date(1_612_137_600_000).toISOString(),
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be inactive if there is a pause start date that is in the past and no pause end', () => {
    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      salutation: 'mr',
      address: '',
      telephone: '',
      email: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });

  it('Should be inactive if there is a pause end date that is in the future and no pause start', () => {
    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      telephone: '',
      email: '',
      salutation: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });

  it('Should be active if the pause has expired', () => {
    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      address: '',
      telephone: '',
      surname: '',
      salutation: '',
      email: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),

      // 1st of June 2020
      pauseEnd: new Date(1_590_969_600_000).toISOString(),
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be inactive if the current date is between the pause start and end dates', () => {
    const customer: CustomerWithChargebeePlan = {
      id: '0',
      address: '',
      salutation: '',
      surname: '',
      firstName: '',
      telephone: '',
      email: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: {
        deliveries: [],
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),

      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });
});
