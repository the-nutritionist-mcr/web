import { render, screen, within, act } from '@testing-library/react';
import MealSelections from './meal-selections';
import userEvent from '@testing-library/user-event';

test('The <MealSelections> component renders without errors', () => {
  render(
    <MealSelections
      mealsAvailable={[]}
      breakfastsAvailable={[]}
      snacksAvailable={[]}
      maxMeals={4}
      maxSnacks={0}
      maxBreakfasts={0}
    />
  );
});

test('The <MealSelections> component disables all the increase buttons when the max is reached', () => {
  render(
    <MealSelections
      mealsAvailable={[
        {
          id: '1',
          title: 'foo-counter',
          description: 'baz',
        },

        {
          id: '2',
          title: 'foobar-counter',
          description: 'bazBash',
        },
      ]}
      breakfastsAvailable={[]}
      snacksAvailable={[]}
      maxMeals={4}
      maxSnacks={0}
      maxBreakfasts={0}
    />
  );

  const fooCounter = screen.getByRole('region', { name: 'foo-counter' });
  const fooBarCounter = screen.getByRole('region', { name: 'foobar-counter' });

  const fooIncrease = within(fooCounter).getByRole('button', {
    name: 'Increase',
  });
  const fooBarIncrease = within(fooBarCounter).getByRole('button', {
    name: 'Increase',
  });

  act(() => {
    userEvent.click(fooIncrease);
  });

  act(() => {
    userEvent.click(fooIncrease);
  });

  act(() => {
    userEvent.click(fooIncrease);
  });

  act(() => {
    userEvent.click(fooBarIncrease);
  });

  expect(fooIncrease).toHaveAttribute('disabled');
  expect(fooBarIncrease).toHaveAttribute('disabled');
});
