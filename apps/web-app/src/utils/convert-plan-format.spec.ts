import { StandardPlan } from '../../../../libs/types/src';
import { convertPlanFormat } from '../../../../libs/utils/src';

describe('convert plan format', () => {
  it('should correctly add extras to the delivery plan', () => {
    const plan: StandardPlan[] = [
      {
        name: 'Mass',
        daysPerWeek: 3,
        itemsPerDay: 2,
        isExtra: false,
        totalMeals: 6,
      },
      {
        name: 'Breakfast',
        daysPerWeek: 2,
        itemsPerDay: 4,
        isExtra: true,
        totalMeals: 8,
      },
    ];
    const result = convertPlanFormat(plan);

    expect(result).toStrictEqual({
      deliveries: [],
    });
  });
});
