import { Customer, Exclusion, Recipe } from '@tnmw/types';
import { mock } from 'jest-mock-extended';
import { getRealRecipe } from './get-real-recipe';

describe('get real recipe', () => {
  it('returns the recipe if alternates is undefined', () => {
    const recipes = [
      mock<Recipe>({
        id: 'recipe-one',
      }),
      mock<Recipe>({
        id: 'recipe-two',
      }),
      mock<Recipe>({
        id: 'recipe-three',
      }),
    ];
    const recipe = mock<Recipe>();
    const customer = mock<Customer>();

    recipe.alternates = undefined;

    const result = getRealRecipe(recipe, customer, recipes);

    expect(result).toBe(recipe);
  });

  it('returns the recipe if alternates is an empty array', () => {
    const recipes = [
      mock<Recipe>({
        id: 'recipe-one',
      }),
      mock<Recipe>({
        id: 'recipe-two',
      }),
      mock<Recipe>({
        id: 'recipe-three',
      }),
    ];
    const recipe = mock<Recipe>();
    const customer = mock<Customer>();

    recipe.alternates = [];

    const result = getRealRecipe(recipe, customer, recipes);

    expect(result).toBe(recipe);
  });

  it('returns the recipe if there are alternates but they dont match the customers customisations', () => {
    const recipes = [
      mock<Recipe>({
        id: 'recipe-one',
      }),
      mock<Recipe>({
        id: 'recipe-two',
      }),
      mock<Recipe>({
        id: 'recipe-three',
      }),
    ];
    const recipe = mock<Recipe>();
    const customer = mock<Customer>({
      exclusions: [
        mock<Exclusion>({
          id: 'foo-bar',
        }),
        mock<Exclusion>({
          id: 'bap',
        }),
      ],
    });

    recipe.alternates = [
      { customisationId: 'baz', recipeId: 'bar' },
      { customisationId: 'bim', recipeId: 'boop' },
    ];

    const result = getRealRecipe(recipe, customer, recipes);

    expect(result).toBe(recipe);
  });

  it('returns the alternate recipe if there is an alternate that matches the customers customisations', () => {
    const recipeTwo = mock<Recipe>({
      id: 'recipe-two',
    });
    const recipes = [
      mock<Recipe>({
        id: 'recipe-one',
      }),
      recipeTwo,
      mock<Recipe>({
        id: 'recipe-three',
      }),
    ];
    const recipe = mock<Recipe>();
    const customer = mock<Customer>({
      exclusions: [
        mock<Exclusion>({
          id: 'foo-bar',
        }),
        mock<Exclusion>({
          id: 'bap',
        }),
      ],
    });

    recipe.alternates = [
      { customisationId: 'baz', recipeId: 'bar' },
      { customisationId: 'bap', recipeId: 'recipe-two' },
    ];

    const result = getRealRecipe(recipe, customer, recipes);

    expect(result).toBe(recipeTwo);
  });

  it('picks the first recipe when there are multiple matches', () => {
    const recipeTwo = mock<Recipe>({
      id: 'recipe-two',
    });

    const recipeThree = mock<Recipe>({
      id: 'recipe-three',
    });
    const recipes = [
      mock<Recipe>({
        id: 'recipe-one',
      }),
      recipeTwo,
      recipeThree,
    ];
    const recipe = mock<Recipe>();
    const customer = mock<Customer>({
      exclusions: [
        mock<Exclusion>({
          id: 'foo-bar',
        }),
        mock<Exclusion>({
          id: 'bap',
        }),
        mock<Exclusion>({
          id: 'boom',
        }),
      ],
    });

    recipe.alternates = [
      { customisationId: 'baz', recipeId: 'bar' },
      { customisationId: 'bap', recipeId: 'recipe-two' },
      { customisationId: 'boom', recipeId: 'recipe-three' },
    ];

    const result = getRealRecipe(recipe, customer, recipes);

    expect(result).toBe(recipeTwo);
  });
});
