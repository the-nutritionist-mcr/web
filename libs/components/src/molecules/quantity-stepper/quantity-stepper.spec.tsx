import QuantityStepper from './quantity-stepper';
import userEvent from '@testing-library/user-event';
import { render, screen, act } from '@testing-library/react';

test('Quantity stepper displays a 0 if there is no value', () => {
  render(<QuantityStepper />);
  expect(screen.getByRole('spinbutton')).toHaveTextContent('0');
});

test('Quantity stepper displays the value passed into the value prop', () => {
  const { rerender } = render(<QuantityStepper value={3} />);
  expect(screen.getByRole('spinbutton')).toHaveTextContent('3');

  rerender(<QuantityStepper value={5} />);
  expect(screen.getByRole('spinbutton')).toHaveTextContent('5');
});

test('Quantity renders the label if there is one', () => {
  render(<QuantityStepper label="Foo" />);
  expect(screen.queryByText('Foo')).toBeInTheDocument();
});

test('Quanity stepper fires the onChange event with the incremented value if the plus button is clicked', () => {
  const onChange = jest.fn();
  render(<QuantityStepper label="foobar" onChange={onChange} />);
});

test('Quantity steppers fires the onChange event with the incremented value if the plus button is clicked', () => {
  const onChange = jest.fn();

  render(<QuantityStepper value={3} onChange={onChange} />);

  act(() => {
    const increaseButton = screen.getByRole('button', { name: 'Increase' });
    userEvent.click(increaseButton);
  });

  expect(onChange).toHaveBeenCalledWith(4);
});

test('Quantity stepper fires the onChange event with the decremented value if the decrease button is clicked', () => {
  const onChange = jest.fn();

  render(<QuantityStepper value={3} onChange={onChange} />);

  act(() => {
    const decreaseButton = screen.getByRole('button', { name: 'Decrease' });
    userEvent.click(decreaseButton);
  });

  expect(onChange).toHaveBeenCalledWith(2);
});

test('Quantity stepper disables the Increase button if the max value is reached', () => {
  const onChange = jest.fn();
  render(<QuantityStepper value={6} max={6} onChange={onChange} />);

  const increaseButton = screen.getByRole('button', { name: 'Increase' });

  expect(increaseButton).toHaveAttribute('disabled');
});

test('Quantity enables the plus button if the max value is not reached', () => {
  const onChange = jest.fn();
  render(<QuantityStepper value={5} max={6} onChange={onChange} />);

  const increaseButton = screen.getByRole('button', { name: 'Increase' });

  expect(increaseButton).not.toHaveAttribute('disabled');
});

test('Quantity stepper disables the decrease button if the min value is reached', () => {
  const onChange = jest.fn();
  render(<QuantityStepper value={3} min={3} onChange={onChange} />);

  const increaseButton = screen.getByRole('button', { name: 'Decrease' });

  expect(increaseButton).toHaveAttribute('disabled');
});

test('Quantity enables the decrease button if the min value is not reached', () => {
  const onChange = jest.fn();
  render(<QuantityStepper value={5} min={3} onChange={onChange} />);

  const increaseButton = screen.getByRole('button', { name: 'Increase' });

  expect(increaseButton).not.toHaveAttribute('disabled');
});

test('Provides the label as the a11y name for the stepper if there is one', () => {
  const onChange = jest.fn();
  render(
    <QuantityStepper value={5} min={3} onChange={onChange} label="foo-label" />
  );
  const spinbutton = screen.getByRole('spinbutton');
  expect(spinbutton).toHaveAccessibleName('foo-label');
});
