import { Customer, Snack } from '@tnmw/types';
import isActive from './isActive';

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
    const customer: Customer = {
      address: '',
      telephone: '',
      salutation: '',
      firstName: '',
      surname: '',
      id: '0',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be active if there is a pause start date that is in the future', () => {
    const customer: Customer = {
      address: '',
      telephone: '',
      salutation: '',
      firstName: '',
      surname: '',
      id: '0',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st February 2021
      pauseStart: new Date(1_612_137_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be inactive if there is a pause start date that is in the past and no pause end', () => {
    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      salutation: 'mr',
      address: '',
      telephone: '',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });

  it('Should be inactive if there is a pause end date that is in the future and no pause start', () => {
    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      telephone: '',
      email: '',
      salutation: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });

  it('Should be active if the pause has expired', () => {
    const customer: Customer = {
      id: '0',
      firstName: '',
      address: '',
      telephone: '',
      surname: '',
      salutation: '',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),

      // 1st of June 2020
      pauseEnd: new Date(1_590_969_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(true);
  });

  it('Should be inactive if the current date is between the pause start and end dates', () => {
    const customer: Customer = {
      id: '0',
      address: '',
      salutation: '',
      surname: '',
      firstName: '',
      telephone: '',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st of March 2020
      pauseStart: new Date(1_583_020_800_000).toISOString(),

      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const active = isActive(customer);

    expect(active).toEqual(false);
  });
});
