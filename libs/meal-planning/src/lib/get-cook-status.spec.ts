import { getCookStatus } from './get-cook-status';
import { mock } from 'jest-mock-extended';
import { StandardPlan } from '@tnmw/types';

const date = (day: number, month: number, year: number) => {
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
};

describe('getCookStatus', () => {
  it.each`
    cookDay              | pauseStart           | pauseEnd             | subscriptionStart   | subscriptionStatus | cancelledAt  | result                                                                                | termEnd
    ${date(11, 6, 2022)} | ${undefined}         | ${undefined}         | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'active' }}                                                               | ${date(12, 7, 2022)}
    ${date(11, 6, 2022)} | ${date(18, 6, 2022)} | ${undefined}         | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'active', pausingOn: date(18, 6, 2022) }}                                 | ${date(12, 7, 2022)}
    ${date(11, 6, 2022)} | ${date(4, 6, 2022)}  | ${undefined}         | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'paused', pausedFrom: date(4, 6, 2022) }}                                 | ${date(12, 7, 2022)}
    ${date(11, 6, 2022)} | ${undefined}         | ${date(18, 6, 2022)} | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'paused', pausedUntil: date(18, 6, 2022) }}                               | ${date(12, 7, 2022)}
    ${date(14, 6, 2022)} | ${date(4, 6, 2022)}  | ${date(12, 6, 2022)} | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'active' }}                                                               | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${date(4, 6, 2022)}  | ${date(12, 6, 2022)} | ${undefined}        | ${'active'}        | ${undefined} | ${{ status: 'paused', pausedUntil: date(12, 6, 2022), pausedFrom: date(4, 6, 2022) }} | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${undefined}         | ${date(2, 6, 2022)} | ${'future'}        | ${undefined} | ${{ status: 'active' }}                                                               | ${date(12, 7, 2022)}
    ${date(1, 6, 2022)}  | ${undefined}         | ${undefined}         | ${date(2, 6, 2022)} | ${'future'}        | ${undefined} | ${{ status: 'future', startsOn: date(2, 6, 2022) }}                                   | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${undefined}         | ${undefined}        | ${'non_renewing'}  | ${undefined} | ${{ status: 'active', cancellingOn: date(12, 7, 2022) }}                              | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${undefined}         | ${undefined}        | ${'in_trial'}      | ${undefined} | ${{ status: 'in_trial' }}                                                             | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${undefined}         | ${undefined}        | ${'paused'}        | ${undefined} | ${{ status: 'paused' }}                                                               | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${date(3, 6, 2022)}  | ${undefined}        | ${'paused'}        | ${undefined} | ${{ status: 'active' }}                                                               | ${date(12, 7, 2022)}
    ${date(2, 6, 2022)}  | ${undefined}         | ${date(3, 6, 2022)}  | ${undefined}        | ${'paused'}        | ${undefined} | ${{ status: 'paused', pausedUntil: date(3, 6, 2022) }}                                | ${date(12, 7, 2022)}
    ${date(5, 6, 2022)}  | ${undefined}         | ${undefined}         | ${undefined}        | ${'cancelled'}     | ${undefined} | ${{ status: 'cancelled' }}                                                            | ${date(12, 7, 2022)}
    ${date(1, 7, 2023)}  | ${date(11, 6, 2023)} | ${undefined}         | ${undefined}        | ${'paused'}        | ${undefined} | ${{ status: 'paused', pausedFrom: date(11, 6, 2023) }}                                | ${date(25, 6, 2023)}
  `(
    `Should return result if the cookday is $cookDay, pause start is $pauseStart and pause end is $pauseEnd with a subscription status of $subscriptionStatus and subscription start of $subscriptionStart`,
    ({
      cookDay,
      pauseStart,
      pauseEnd,
      subscriptionStatus,
      subscriptionStart,
      result,
      termEnd,
    }) => {
      const mockPlan = mock<StandardPlan>({
        pauseStart: pauseStart?.getTime(),
        pauseEnd: pauseEnd?.getTime(),
        subscriptionStatus,
        startDate: subscriptionStart?.getTime(),
        termEnd: termEnd?.getTime(),
      });

      const outcome = getCookStatus(cookDay, mockPlan);

      expect(outcome.status).toEqual(result.status);

      switch (outcome.status) {
        case 'active':
          if (result.pausingOn) {
            expect(outcome.pausingOn).toBeSameDayAs(result.pausingOn);
          } else {
            expect(outcome.pausingOn).toBeUndefined();
          }
          break;

        case 'paused':
          if (result.pausedFrom) {
            expect(outcome.pausedFrom).toBeSameDayAs(result.pausedFrom);
          } else {
            expect(outcome.pausedFrom).toBeUndefined();
          }
          if (result.pausedUntil) {
            expect(outcome.pausedUntil).toBeSameDayAs(result.pausedUntil);
          } else {
            expect(outcome.pausedUntil).toBeUndefined();
          }
          break;

        case 'future':
          if (result.startsOn) {
            expect(outcome.startsOn).toBeSameDayAs(result.startsOn);
          } else {
            expect(outcome.startsOn).toBeUndefined();
          }
          break;
      }
    }
  );
});
