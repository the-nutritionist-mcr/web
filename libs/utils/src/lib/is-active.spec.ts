import { isActive } from './is-active';
import { mock } from 'jest-mock-extended';
import { StandardPlan } from '@tnmw/types';

const date = (day: number, month: number, year: number) => {
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
};

describe('isActive', () => {
  it('Should return true if there is no pause start or end', () => {
    const mockPlan = mock<StandardPlan>();

    const active = isActive(new Date(Date.now()), [mockPlan]);

    expect(active).toEqual(true);
  });

  it('Should be active if there is a pause start date that is in the future', () => {
    const now = date(11, 6, 2022);

    const mockPlan = mock<StandardPlan>({
      pauseStart: date(18, 6, 2022).getTime(),
      pauseEnd: undefined,
    });

    const active = isActive(now, [mockPlan]);

    expect(active).toEqual(true);
  });

  it('Should be inactive if there is a pause start date that is in the past and no pause end', () => {
    const now = date(11, 6, 2022);

    const mockPlan = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: undefined,
    });

    const active = isActive(now, [mockPlan]);

    expect(active).toEqual(false);
  });

  it('Should be inactive if there is a pause end date that is in the future and no pause start', () => {
    const now = date(11, 6, 2022);

    const mockPlan = mock<StandardPlan>({
      pauseStart: undefined,
      pauseEnd: date(18, 6, 2022).getTime(),
    });

    const active = isActive(now, [mockPlan]);

    expect(active).toEqual(false);
  });

  it('Should be active if the pause has expired', () => {
    const now = date(14, 6, 2022);

    const mockPlan = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const active = isActive(now, [mockPlan]);

    expect(active).toEqual(true);
  });

  it('should return true if there are multiple plans and all plans are active', () => {
    const now = date(1, 6, 2022);

    const mockPlan1 = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan2 = mock<StandardPlan>({
      pauseStart: date(6, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan3 = mock<StandardPlan>({
      pauseStart: undefined,
      pauseEnd: undefined,
    });

    const active = isActive(now, [mockPlan1, mockPlan2, mockPlan3]);

    expect(active).toEqual(true);
  });

  it('should falsetrue if there are multiple plans and all plans are inactive', () => {
    const now = date(7, 6, 2022);

    const mockPlan1 = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan2 = mock<StandardPlan>({
      pauseStart: date(6, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan3 = mock<StandardPlan>({
      pauseStart: date(1, 7, 2022).getTime(),
      pauseEnd: undefined,
    });

    const active = isActive(now, [mockPlan1, mockPlan2, mockPlan3]);

    expect(active).toEqual(false);
  });

  it('should return true if there are multiple plans and even one plan is inactive', () => {
    const now = date(1, 6, 2022);

    const mockPlan1 = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan2 = mock<StandardPlan>({
      pauseStart: date(8, 5, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const mockPlan3 = mock<StandardPlan>({
      pauseStart: undefined,
      pauseEnd: undefined,
    });

    const active = isActive(now, [mockPlan1, mockPlan2, mockPlan3]);

    expect(active).toEqual(false);
  });

  it('Should be inactive if the current date is between the pause start and end dates', () => {
    const now = date(5, 6, 2022);

    const mockPlan = mock<StandardPlan>({
      pauseStart: date(4, 6, 2022).getTime(),
      pauseEnd: date(12, 6, 2022).getTime(),
    });

    const active = isActive(now, [mockPlan]);

    expect(active).toEqual(false);
  });
});
