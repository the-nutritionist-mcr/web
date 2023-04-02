import {
  BackendCustomer,
  DeliveryMeal,
  Exclusion,
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
  it(`correctly counts duplicates`, () => {
    const [customerOne, customerThree] = generateCustomers(3);

    const noBroccoli = mock<Exclusion>({
      id: 'no-broccoli',
    });

    const customerTwo = mock<BackendCustomer>({
      customisations: [noBroccoli],
    });

    const [one, four, three, nine, five, six, seven, eight] = Array.from({
      length: 8,
    }).map((_, index) =>
      mock<Recipe>({
        id: `recipe-${index}`,
        name: `recipe-${index}`,
        potentialExclusions: [],
        alternates: [],
      })
    );

    const recipeToSwap = mock<Recipe>({
      id: `recipe-to-swap`,
      name: `recipe-to-swap`,
      alternates: [],
      potentialExclusions: [],
    });

    const two = mock<Recipe>({
      id: `recipe-9`,
      name: `recipe-9`,
      potentialExclusions: [],
      alternates: [
        {
          customisationId: noBroccoli.id,
          recipeId: recipeToSwap.id,
        },
      ],
    });

    const plan: MealPlanGeneratedForIndividualCustomer[] = [
      {
        wasUpdatedByCustomer: false,
        customer: customerOne,
        deliveries: [
          {
            paused: false,
            dateCooked: new Date(),
            plans: [
              {
                status: 'active',
                id: `plan0`,
                planId: `plan0`,
                name: `Mass`,
                meals: [
                  ...generateDeliveryMeals('Mass', [one, one, three, four]),
                ],
                isExtra: false,
              },
            ],
          },
          {
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
      [one, two, three, four, five, six, seven, eight, nine, recipeToSwap],
      plannedCooks
    );

    expect(result).toHaveLength(2);
    expect(result[0].plan).toHaveLength(4);
    expect(result[1].plan).toHaveLength(5);

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: one,
          alternates: [],
          primaries: expect.arrayContaining([
            expect.objectContaining({
              fullName: 'Mass',
              planName: 'Mass',
              count: 3,
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: two,
          alternates: [
            [
              expect.objectContaining({
                fullName: 'Micro',
                planName: 'Micro',
                count: 1,
              }),
            ],
          ],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: three,
          alternates: [],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: four,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: five,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: seven,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: nine,
          alternates: [],
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
  it(`doesn't include alternates in the primaries count`, () => {
    const [customerOne, customerThree] = generateCustomers(3);

    const noBroccoli = mock<Exclusion>({
      id: 'no-broccoli',
    });

    const customerTwo = mock<BackendCustomer>({
      customisations: [noBroccoli],
    });

    const [one, four, three, nine, five, six, seven, eight] = Array.from({
      length: 8,
    }).map((_, index) =>
      mock<Recipe>({
        id: `recipe-${index}`,
        name: `recipe-${index}`,
        potentialExclusions: [],
        alternates: [],
      })
    );

    const recipeToSwap = mock<Recipe>({
      id: `recipe-to-swap`,
      name: `recipe-to-swap`,
      alternates: [],
      potentialExclusions: [],
    });

    const two = mock<Recipe>({
      id: `recipe-9`,
      name: `recipe-9`,
      potentialExclusions: [],
      alternates: [
        {
          customisationId: noBroccoli.id,
          recipeId: recipeToSwap.id,
        },
      ],
    });

    const plan: MealPlanGeneratedForIndividualCustomer[] = [
      {
        wasUpdatedByCustomer: false,
        customer: customerOne,
        deliveries: [
          {
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
      [one, two, three, four, five, six, seven, eight, nine, recipeToSwap],
      plannedCooks
    );

    expect(result).toHaveLength(2);
    expect(result[0].plan).toHaveLength(4);
    expect(result[1].plan).toHaveLength(5);

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: one,
          alternates: [],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: two,
          alternates: [
            [
              expect.objectContaining({
                fullName: 'Micro',
                planName: 'Micro',
                count: 1,
              }),
            ],
          ],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: three,
          alternates: [],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: four,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: five,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: seven,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: nine,
          alternates: [],
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

  it(`Correctly separates customised meals`, () => {
    const [customerThree] = generateCustomers(3);

    const noBroccoli = mock<Exclusion>({
      id: 'no-broccoli',
      name: 'no-cheese',
      allergen: false,
    });

    const noCheese = mock<Exclusion>({
      id: 'no-cheese',
      name: 'no-cheese',
      allergen: false,
    });

    const customerTwo = mock<BackendCustomer>({
      customisations: [noBroccoli, noCheese],
    });

    const customerOne = mock<BackendCustomer>({
      customisations: [noCheese],
    });

    const [one, four, nine, five, six, seven, eight] = Array.from({
      length: 8,
    }).map((_, index) =>
      mock<Recipe>({
        id: `recipe-${index}`,
        name: `recipe-${index}`,
        potentialExclusions: [],
        alternates: [],
      })
    );

    const three = mock<Recipe>({
      id: `recipe-three`,
      name: `recipe-three`,
      alternates: [],
      potentialExclusions: [noCheese],
    });

    const recipeToSwap = mock<Recipe>({
      id: `recipe-to-swap`,
      name: `recipe-to-swap`,
      alternates: [],
      potentialExclusions: [noCheese],
    });

    const two = mock<Recipe>({
      id: `recipe-9`,
      name: `recipe-9`,
      potentialExclusions: [],
      alternates: [
        {
          customisationId: noBroccoli.id,
          recipeId: recipeToSwap.id,
        },
      ],
    });

    const plan: MealPlanGeneratedForIndividualCustomer[] = [
      {
        wasUpdatedByCustomer: false,
        customer: customerOne,
        deliveries: [
          {
            dateCooked: new Date(),
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
      [one, two, three, four, five, six, seven, eight, nine, recipeToSwap],
      plannedCooks
    );

    expect(result).toHaveLength(2);
    expect(result[0].plan).toHaveLength(4);
    expect(result[1].plan).toHaveLength(5);

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: one,
          alternates: [],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: two,
          alternates: [
            [
              expect.objectContaining({
                fullName: 'Micro (no-cheese)',
                planName: 'Micro',
                count: 1,
              }),
            ],
          ],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: three,
          alternates: [],
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

    expect(result[0].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: four,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: five,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: seven,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: eight,
          alternates: [],
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

    expect(result[1].plan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mainRecipe: nine,
          alternates: [],
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

  it('Correctly counts meals when there is no customisations or alternates at all', () => {
    const [customerOne, customerTwo, customerThree] = generateCustomers(3);

    const [one, two, three, four, five, six, seven, eight, nine] = Array.from({
      length: 9,
    }).map((_, index) =>
      mock<Recipe>({
        id: `recipe-${index}`,
        name: `recipe-${index}`,
        potentialExclusions: [],
        alternates: [],
      })
    );

    const plan: MealPlanGeneratedForIndividualCustomer[] = [
      {
        wasUpdatedByCustomer: false,
        customer: customerOne,
        deliveries: [
          {
            dateCooked: new Date(),
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
            paused: false,
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
    expect(result[0].plan).toHaveLength(4);
    expect(result[1].plan).toHaveLength(5);

    if (!result[0].plan[0].isExtra) {
      expect(result[0].plan[0].primaries).toHaveLength(2);
    }
    if (!result[0].plan[1].isExtra) {
      expect(result[0].plan[1].primaries).toHaveLength(2);
    }
    if (!result[0].plan[3].isExtra) {
      expect(result[0].plan[3].primaries).toHaveLength(1);
    }
    if (!result[1].plan[0].isExtra) {
      expect(result[1].plan[0].primaries).toHaveLength(2);
    }
    if (!result[1].plan[1].isExtra) {
      expect(result[1].plan[1].primaries).toHaveLength(2);
    }
    if (!result[1].plan[2].isExtra) {
      expect(result[1].plan[2].primaries).toHaveLength(2);
    }
    if (!result[1].plan[3].isExtra) {
      expect(result[1].plan[3].primaries).toHaveLength(1);
    }

    expect(result[0].plan).toEqual(
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

    expect(result[0].plan).toEqual(
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

    expect(result[0].plan).toEqual(
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

    expect(result[0].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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

    expect(result[1].plan).toEqual(
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
