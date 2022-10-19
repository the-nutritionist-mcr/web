import { BackendCustomer, PlannedCook, StandardPlan } from '@tnmw/types';
import { mock } from 'jest-mock-extended';
import { getClosedOrOpenStatus } from './get-closed-or-open-status';

const date = (day: number, month: number, year: number, hour: number) => {
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  date.setHours(hour);
  return date;
};

const customer = mock<BackendCustomer>({
  plans: [
    mock<StandardPlan>({
      subscriptionStatus: 'active',
      pauseEnd: undefined,
      pauseStart: undefined,
    }),
  ],
});

const cooks = [
  mock<PlannedCook>({
    date: date(26, 7, 2022, 12),
  }),
];

describe('get closed or open status', () => {
  it.each`
    nowDay | nowMonth | nowYear | nowHour | data                                                                                                                            | open
    ${30}  | ${7}     | ${2022} | ${11}   | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${false}
    ${30}  | ${7}     | ${2022} | ${11}   | ${undefined}                                                                                                                    | ${false}
    ${25}  | ${7}     | ${2022} | ${11}   | ${undefined}                                                                                                                    | ${false}
    ${27}  | ${7}     | ${2022} | ${11}   | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${true}
    ${28}  | ${7}     | ${2022} | ${0}    | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${false}
    ${26}  | ${7}     | ${2022} | ${11}   | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${true}
    ${26}  | ${7}     | ${2022} | ${11}   | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: false, currentUserSelection: {}, customer }} | ${false}
    ${25}  | ${7}     | ${2022} | ${17}   | ${{ available: true, plan: { createdOn: date(25, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${true}
    ${25}  | ${7}     | ${2022} | ${17}   | ${{ available: true, plan: { createdOn: date(18, 7, 2022, 12), cooks }, published: true, currentUserSelection: {}, customer }}  | ${false}
  `(
    `When date is $nowDay/$nowMonth/$nowYear:$nowHour and data is $data, result should be $open`,
    ({ nowDay, nowMonth, nowYear, nowHour, data, open }) => {
      const now = date(nowDay, nowMonth, nowYear, nowHour);

      const result = getClosedOrOpenStatus(now, data, customer);

      expect(result).toEqual(open);
    }
  );
});
