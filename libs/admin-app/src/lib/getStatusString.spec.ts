import moment, { Moment } from 'moment';
import getStatusString from './getStatusString';
import isActive from './isActive';
import { mock } from 'jest-mock-extended';
import { mocked } from 'jest-mock';
import { Customer, Snack } from '@tnmw/types';

jest.mock('./isActive');
jest.mock('moment');

describe('Get status string', () => {
  const oldDateNow = Date.now.bind(global.Date);

  beforeEach(() => {
    // 17th November 2020
    const dateNowStub = jest.fn(() => 1_605_635_814_000);
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.Date.now = oldDateNow;
  });

  it("Should return 'Active' if isActive returns true and there is no pauseStart", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);
    mocked(isActive, true).mockReturnValue(true);

    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      salutation: '',
      telephone: '',
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

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Active');
  });

  it("Should return 'Active' if isActive returns true and the pauseStart is in the past", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);
    mocked(isActive, true).mockReturnValue(true);

    const customer: Customer = {
      id: '0',
      surname: '',
      firstName: '',
      address: '',
      telephone: '',
      salutation: '',
      email: '',
      daysPerWeek: 1,
      plan: {
        name: 'Mass 1',
        category: 'Mass',
        mealsPerDay: 1,
        costPerMeal: 1,
      },
      // 1st of June 2020
      pauseStart: new Date(1_590_969_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Active');
  });

  it("Should return 'Active until The Date' if isActive returns true and the pauseStart is in the future", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);
    mocked(isActive, true).mockReturnValue(true);

    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      salutation: '',
      telephone: '',
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

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Active until The Date');
  });

  it("Should return 'Paused' if isActive returns false and there is no pauseEnd", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);
    mocked(isActive, true).mockReturnValue(false);

    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      telephone: '',
      address: '',
      email: '',
      salutation: '',
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

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Paused');
  });

  it("Should return 'Paused until The Date' if isActive returns false and the pauseEnd is in the future", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);
    mocked(isActive, true).mockReturnValue(false);

    const customer: Customer = {
      id: '0',
      firstName: '',
      surname: '',
      salutation: '',
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
      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      snack: Snack.None,
      breakfast: false,
      exclusions: [],
    };

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Paused until The Date');
  });
});
