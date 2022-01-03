import IconButton from './icon-button';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('The icon button should render without errors', () => {
  render(<IconButton icon="icon" a11yLabel="foo" />);
});

test('Should contain a button', () => {
  render(<IconButton icon="icon" a11yLabel="foo" />);
  screen.getByRole('button');
});

test('Button element should have the a11y name that is passed in as a11yLabel', () => {
  render(<IconButton icon="icon" a11yLabel="foo-name" />);
  const button = screen.getByRole('button');
  expect(button).toHaveAccessibleName('foo-name');
});

test('Should fire onClick when the button is clicked', () => {
  const onClick = jest.fn();
  render(<IconButton icon="icon" a11yLabel="foo" onClick={onClick} />);
  const button = screen.getByRole('button');

  act(() => {
    userEvent.click(button);
  });

  expect(onClick).toHaveBeenCalled();
});

test('Should disable the button when disabled prop is passed', () => {
  render(<IconButton icon="icon" a11yLabel="foo" disabled />);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('disabled');
});
