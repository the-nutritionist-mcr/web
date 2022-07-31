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
  it.each`
    cookDay              | pauseStart           | pauseEnd             | subscriptionStatus | active
    ${date(11, 6, 2022)} | ${undefined}         | ${undefined}         | ${'active'}        | ${true}
    ${date(11, 6, 2022)} | ${date(18, 6, 2022)} | ${undefined}         | ${'active'}        | ${true}
    ${date(11, 6, 2022)} | ${date(4, 6, 2022)}  | ${undefined}         | ${'active'}        | ${false}
    ${date(11, 6, 2022)} | ${undefined}         | ${date(18, 6, 2022)} | ${'active'}        | ${false}
    ${date(14, 6, 2022)} | ${date(4, 6, 2022)}  | ${date(12, 6, 2022)} | ${'active'}        | ${true}
    ${date(5, 6, 2022)}  | ${date(4, 6, 2022)}  | ${date(12, 6, 2022)} | ${'active'}        | ${false}
  `(
    `Should return $active if the cookday is $cookDay, pause start is $pauseStart and pause end is $pauseEnd with a subscription status of $subscriptionStatus`,
    ({ cookDay, pauseStart, pauseEnd, subscriptionStatus, active }) => {
      const mockPlan = mock<StandardPlan>({
        pauseStart: pauseStart?.getTime(),
        pauseEnd: pauseEnd?.getTime(),
        subscriptionStatus,
      });

      const outcome = isActive(cookDay, [mockPlan]);

      expect(outcome).toEqual(active);
    }
  );

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
});
