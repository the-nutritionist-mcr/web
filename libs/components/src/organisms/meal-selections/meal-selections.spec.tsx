import { render, screen, within, act } from '@testing-library/react';
import MealSelections from './meal-selections';
import userEvent from '@testing-library/user-event';
import { Theme } from '../../types/my-theme';
import { ThemeProvider } from '@emotion/react';

export const theme: Theme = {
  colors: {
    callToAction: '#3b7d7a',
    buttonBlack: '#292929',
    labelText: '#141414',
  },
  menubarHeight: 88,
  breakpoints: {
    small: {
      end: 400,
    },
    medium: {
      start: 401,
      end: 900,
    },
    large: {
      start: 601,
    },
  },
};

const availableMeals = [
  {
    title: 'EQ Delivery 1',
    maxMeals: 3,
    options: [
      [
        {
          id: '1',
          title: 'Yummy chicken',
          description: 'Mmmmm',
        },
        {
          id: '2',
          title: 'Yummy rice',
          description: 'Blah',
        },
        {
          id: '3',
          title: 'Fish',
          description: 'Swim',
        },
      ],
      [
        {
          id: '4',
          title: 'Cheese',
          description: 'Cheesy',
        },
        {
          id: '3',
          title: 'Bread',
          description: 'Make toast with me?',
        },
        {
          id: '4',
          title: 'Salmon',
          description: 'Expensive',
        },
      ],
      [
        {
          id: '5',
          title: 'Glass',
          description: 'Shiny',
        },
        {
          id: '6',
          title: 'Water',
          description: 'Wet',
        },
        {
          id: '7',
          title: 'Rain',
          description: 'Getting tenuous',
        },
      ],
    ],
  },
];

test('The <MealSelections> component renders without errors', () => {
  render(
    <ThemeProvider theme={theme}>
      <MealSelections availableMeals={availableMeals} deliveryDates={[]} />
    </ThemeProvider>
  );
});

test('The <MealSelections> component disables all the increase buttons when the max is reached', () => {
  render(
    <ThemeProvider theme={theme}>
      <MealSelections availableMeals={availableMeals} deliveryDates={[]} />
      );
    </ThemeProvider>
  );

  const fooCounter = screen.getByRole('region', { name: 'Yummy chicken' });
  const fooBarCounter = screen.getByRole('region', { name: 'Yummy rice' });

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

  expect(fooIncrease).toHaveAttribute('disabled');
  expect(fooBarIncrease).toHaveAttribute('disabled');
});
