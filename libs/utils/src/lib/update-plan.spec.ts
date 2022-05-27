import { SelectedMeal } from '@tnmw/meal-planning';
import { HotOrCold, NewDelivery, Recipe } from '@tnmw/types';
import { updateDelivery } from './update-plan';

const recipeOne: Recipe = {
  id: '0',
  hotOrCold: HotOrCold.Hot,
  shortName: 'foo',
  name: 'foo-recipe',
  potentialExclusions: [],
};

const recipeTwo: Recipe = {
  id: '1',
  hotOrCold: HotOrCold.Hot,
  shortName: 'bar',
  name: 'bar-recipe',
  potentialExclusions: [],
};

const recipeThree: Recipe = {
  id: '2',
  hotOrCold: HotOrCold.Hot,
  shortName: 'baz',
  name: 'baz-recipe',
  potentialExclusions: [],
};

const recipeFour: Recipe = {
  id: '5',
  hotOrCold: HotOrCold.Hot,
  shortName: 'bap',
  name: 'bap-recipe',
  potentialExclusions: [],
};

const recipeFive: Recipe = {
  id: '8',
  hotOrCold: HotOrCold.Hot,
  shortName: 'balls',
  name: 'balls-recipe',
  potentialExclusions: [],
};

const recipeSix: Recipe = {
  id: '8',
  hotOrCold: HotOrCold.Hot,
  shortName: 'balls',
  name: 'balls-recipe',
  potentialExclusions: [],
};

const recipeSeven: Recipe = {
  id: '11',
  hotOrCold: HotOrCold.Hot,
  shortName: 'foo-two',
  name: 'foo-two-recipe',
  potentialExclusions: [],
};

const recipeEight: Recipe = {
  id: '15',
  hotOrCold: HotOrCold.Hot,
  shortName: 'bar-two',
  name: 'bar-recipe-two',
  potentialExclusions: [],
};

const recipeNine: Recipe = {
  id: '2',
  hotOrCold: HotOrCold.Hot,
  shortName: 'baz-two',
  name: 'baz-recipe-two',
  potentialExclusions: [],
};

const recipeTen: Recipe = {
  id: '5',
  hotOrCold: HotOrCold.Hot,
  shortName: 'bap-two',
  name: 'bap-recipe-two',
  potentialExclusions: [],
};

const delivery: NewDelivery[] = [
  [
    { recipe: recipeOne, chosenVariant: 'Micro' },
    { recipe: recipeTwo, chosenVariant: 'Micro' },
    { recipe: recipeThree, chosenVariant: 'Micro' },
  ],
  [
    { recipe: recipeFour, chosenVariant: 'Micro' },
    { recipe: recipeFive, chosenVariant: 'Micro' },
    { recipe: recipeSix, chosenVariant: 'Micro' },
  ],
  [
    { recipe: recipeSeven, chosenVariant: 'Micro' },
    { recipe: recipeEight, chosenVariant: 'Micro' },
    { recipe: recipeNine, chosenVariant: 'Micro' },
  ],
];

describe('update delivery', () => {
  it('changes a recipe correctly when passed a recipe', () => {
    const result = updateDelivery(delivery, {
      recipe: recipeTen,
      selectionId: 'foo',
      selectionSort: 'bar',
      deliveryIndex: 1,
      chosenVariant: 'Micro',
      itemIndex: 2,
    });

    const itemToCheck = result[1][2] as SelectedMeal;
    expect(itemToCheck.recipe).toEqual(recipeTen);

    const itemToRemain = result[0][1] as SelectedMeal;
    expect(itemToRemain.recipe).toEqual(recipeTwo);
  });

  it('removes an item when passed no recipe and no variant', () => {
    const result = updateDelivery(delivery, {
      selectionId: 'foo',
      selectionSort: 'bar',
      deliveryIndex: 1,
      itemIndex: 1,
    });

    const itemToCheck = result[1][1] as SelectedMeal;
    expect(itemToCheck.recipe).toEqual(recipeSix);

    expect(result[1]).toHaveLength(2);

    const itemToRemain = result[0][1] as SelectedMeal;
    expect(itemToRemain.recipe).toEqual(recipeTwo);
  });

  it('results in an empty list when removing the last item', () => {
    const specialDelivery: NewDelivery[] = [
      [
        { recipe: recipeOne, chosenVariant: 'Micro' },
        { recipe: recipeTwo, chosenVariant: 'Micro' },
        { recipe: recipeThree, chosenVariant: 'Micro' },
      ],
      [{ recipe: recipeFour, chosenVariant: 'Micro' }],
      [
        { recipe: recipeSeven, chosenVariant: 'Micro' },
        { recipe: recipeEight, chosenVariant: 'Micro' },
        { recipe: recipeNine, chosenVariant: 'Micro' },
      ],
    ];

    const result = updateDelivery(specialDelivery, {
      selectionId: 'foo',
      selectionSort: 'bar',
      deliveryIndex: 1,
      itemIndex: 0,
    });

    expect(result[1]).toHaveLength(0);

    const itemToRemain = result[0][1] as SelectedMeal;
    expect(itemToRemain.recipe).toEqual(recipeTwo);
  });

  it('adds an item when passed no itemIndex and a recipe', () => {
    const result = updateDelivery(delivery, {
      selectionId: 'foo',
      selectionSort: 'bar',
      recipe: recipeTen,
      deliveryIndex: 1,
      chosenVariant: 'Micro',
    });

    const itemToRemain = result[1][1] as SelectedMeal;
    expect(itemToRemain.recipe).toEqual(recipeFive);

    expect(result[1]).toHaveLength(4);

    const itemToCheck = result[1][3] as SelectedMeal;

    expect(itemToCheck.chosenVariant).toEqual('Micro');
    expect(itemToCheck.recipe).toEqual(recipeTen);

    const otherItemToRemain = result[0][1] as SelectedMeal;
    expect(otherItemToRemain.recipe).toEqual(recipeTwo);
  });

  it('switches to extra if not passed a recipe but a variant is passed', () => {
    const result = updateDelivery(delivery, {
      selectionId: 'foo',
      selectionSort: 'bar',
      deliveryIndex: 1,
      chosenVariant: 'Breakfast',
      itemIndex: 2,
    });

    const itemToCheck = result[1][2] as SelectedMeal;

    expect(itemToCheck.recipe).toBeUndefined();
    expect(itemToCheck.chosenVariant).toEqual('Breakfast');

    expect(result[1]).toHaveLength(3);

    const itemToRemain = result[0][1] as SelectedMeal;
    expect(itemToRemain.recipe).toEqual(recipeTwo);
  });
});
