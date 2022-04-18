import moment, { Moment } from 'moment';
import getStatusString from './get-status-string';
import isActive from './is-active';
import { mock } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { CustomerWithChargebeePlan } from '@tnmw/types';

jest.mock('./is-active');
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

    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      salutation: '',
      telephone: '',
      email: '',
      newPlan: { deliveries: [] },
      chargebeePlan: {
        name: 'Mass',
        daysPerWeek: 1,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
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

    const customer: CustomerWithChargebeePlan = {
      id: '0',
      surname: '',
      firstName: '',
      address: '',
      telephone: '',
      salutation: '',
      email: '',
      newPlan: { deliveries: [] },
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      // 1st of June 2020
      pauseStart: new Date(1_590_969_600_000).toISOString(),
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

    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      address: '',
      salutation: '',
      telephone: '',
      email: '',

      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },

      newPlan: { deliveries: [] },

      // 1st February 2021
      pauseStart: new Date(1_612_137_600_000).toISOString(),
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

    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      telephone: '',
      address: '',
      email: '',
      salutation: '',
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      newPlan: { deliveries: [] },
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

    const customer: CustomerWithChargebeePlan = {
      id: '0',
      firstName: '',
      surname: '',
      salutation: '',
      address: '',
      telephone: '',
      email: '',
      newPlan: { deliveries: [] },
      chargebeePlan: {
        name: 'Equilibrium',
        daysPerWeek: 6,
        itemsPerDay: 5,
        isExtra: false,
        totalMeals: 30,
      },
      // 1st February 2021
      pauseEnd: new Date(1_612_137_600_000).toISOString(),
      exclusions: [],
    };

    const statusString = getStatusString(customer);
    expect(statusString).toEqual('Paused until The Date');
  });
});
