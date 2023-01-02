import {
  BackendCustomer,
  DeliveryMeal,
  MealPlanGeneratedForIndividualCustomer,
  Recipe,
} from '@tnmw/types';
import mock from 'jest-mock-extended/lib/Mock';
import { makeCookPlan } from './make-cook-plan-v2';

const generateCustomers = (count: number) =>
  Array.from({ length: count }).map(() =>
    mock<BackendCustomer>({
      customisations: [],
    })
  );

const generateDeliveryMeals = (
  variant: string,
  recipes: Recipe[]
): DeliveryMeal[] =>
  Array.from({ length: recipes.length }).map((_, index) => {
    return {
      recipe: recipes[index],
      isExtra: false,
      chosenVariant: variant,
    };
  });

describe('make cook plan', () => {
  it('Correctly counts meals when there is no customisations or alternates at all', () => {
    const [customerOne, customerTwo, customerThree] = generateCustomers(3);

    const [one, two, three, four, five, six, seven, eight, nine] = Array.from({
      length: 9,
    }).map((_, index) =>
      mock<Recipe>({
        id: `recipe-${index}`,
        name: `recipe-${index}`,
        potentialExclusions: [],
      })
    );

    const plan: MealPlanGeneratedForIndividualCustomer[] = [
      {
        wasUpdatedByCustomer: false,
        customer: customerOne,
        deliveries: [
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan0`,
                planId: `plan0`,
                name: `Mass`,
                meals: [
                  ...generateDeliveryMeals('Mass', [one, two, three, four]),
                ],
                isExtra: false,
              },
            ],
          },
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan3`,
                planId: `plan3`,
                name: `Mass`,
                meals: [...generateDeliveryMeals('Mass', [five, six, seven])],
                isExtra: false,
              },
            ],
          },
        ],
      },
      {
        wasUpdatedByCustomer: false,
        customer: customerTwo,
        deliveries: [
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan1`,
                planId: `plan1`,
                name: `Micro`,
                meals: [...generateDeliveryMeals('Micro', [one, two])],
                isExtra: false,
              },
            ],
          },
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan2`,
                planId: `plan2`,
                name: `Micro`,
                meals: [
                  ...generateDeliveryMeals('Micro', [five, six, seven, eight]),
                ],
                isExtra: false,
              },
            ],
          },
        ],
      },
      {
        wasUpdatedByCustomer: false,
        customer: customerThree,
        deliveries: [
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan4`,
                planId: `plan4`,
                name: `Mass`,
                meals: [...generateDeliveryMeals('Mass', [one, two, three])],
                isExtra: false,
              },
            ],
          },
          {
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan7`,
                planId: `plan7`,
                name: `Mass`,
                meals: [...generateDeliveryMeals('Mass', [seven, nine])],
                isExtra: false,
              },
            ],
          },
        ],
      },
    ];

    const plannedCooks = [
      {
        date: new Date(),
        menu: [one, two, three, four],
      },
      {
        date: new Date(),
        menu: [five, six, seven, eight, nine],
      },
    ];

    const result = makeCookPlan(
      plan,
      [one, two, three, four, five, six, seven],
      plannedCooks
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(4);
    expect(result[1]).toHaveLength(5);

    expect(result[0][0].primaries).toHaveLength(2);
    expect(result[0][1].primaries).toHaveLength(2);
    expect(result[0][3].primaries).toHaveLength(1);
    expect(result[1][0].primaries).toHaveLength(2);
    expect(result[1][1].primaries).toHaveLength(2);
    expect(result[1][2].primaries).toHaveLength(2);
    expect(result[1][3].primaries).toHaveLength(1);

    expect(result[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: one,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 2,
            }),
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: two,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 2,
            }),
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: three,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 2,
            }),
          ]),
        }),
      ])
    );

    expect(result[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: four,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: five,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 1,
            }),
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: six,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 1,
            }),
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: seven,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 2,
            }),
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Micro',
              planName: 'Micro',
              count: 1,
            }),
          ]),
        }),
      ])
    );

    expect(result[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: nine,
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 1,
            }),
          ]),
        }),
      ])
    );
  });
});
