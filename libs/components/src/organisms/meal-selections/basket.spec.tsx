import Basket from './basket';
import { render, screen } from '@testing-library/react';

test('The <Basket> component renders without errors', () => {
  render(
    <Basket
      available={[]}
      itemWord="foo"
      itemWordPlural="foos"
      selectedMeals={{}}
      setSelected={jest.fn()}
      max={0}
    />
  );
});

test('The <Basket> component renders nothing when there is no items selected', () => {
  render(
    <Basket
      available={[]}
      itemWord="foo"
      itemWordPlural="foos"
      selectedMeals={{}}
      setSelected={jest.fn()}
      max={0}
    />
  );

  const spinButtons = screen.queryByRole('spinbutton');
  expect(spinButtons).toBeFalsy();
});
