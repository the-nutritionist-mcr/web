import { getClosedOrOpenStatus } from './get-closed-or-open-status';

const date = (day: number, month: number, year: number, hour: number) => {
  const date = new Date();

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  date.setHours(hour);
  return date;
};

describe('get closed or open status', () => {
  it.each`
    nowDay | nowMonth | nowYear | nowHour | data                                                                  | open
    ${30}  | ${7}     | ${2022} | ${11}   | ${{ available: true, date: date(25, 7, 2022, 12), published: true }}  | ${false}
    ${30}  | ${7}     | ${2022} | ${11}   | ${undefined}                                                          | ${false}
    ${25}  | ${7}     | ${2022} | ${11}   | ${undefined}                                                          | ${false}
    ${27}  | ${7}     | ${2022} | ${11}   | ${{ available: true, date: date(25, 7, 2022, 12), published: true }}  | ${true}
    ${27}  | ${7}     | ${2022} | ${14}   | ${{ available: true, date: date(25, 7, 2022, 12), published: true }}  | ${false}
    ${26}  | ${7}     | ${2022} | ${11}   | ${{ available: true, date: date(25, 7, 2022, 12), published: true }}  | ${true}
    ${26}  | ${7}     | ${2022} | ${11}   | ${{ available: true, date: date(25, 7, 2022, 12), published: false }} | ${false}
    ${25}  | ${7}     | ${2022} | ${17}   | ${{ available: true, date: date(25, 7, 2022, 12), published: true }}  | ${true}
    ${25}  | ${7}     | ${2022} | ${17}   | ${{ available: true, date: date(18, 7, 2022, 12), published: true }}  | ${false}
  `(
    `When date is $nowDay/$nowMonth/$nowYear:$nowHour and data is $data, result should be $open`,
    ({ nowDay, nowMonth, nowYear, nowHour, data, open }) => {
      const now = date(nowDay, nowMonth, nowYear, nowHour);

      const result = getClosedOrOpenStatus(now, data);

      expect(result).toEqual(open);
    }
  );
});
