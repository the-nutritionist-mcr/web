import { act, render, screen, within } from '@testing-library/react';
import Recipes from './Recipes';
import userEvent from '@testing-library/user-event';
import { defaultDeliveryDays } from '../../lib/config';
import { mock } from 'jest-mock-extended';
import Recipe from '../../domain/Recipe';

test.skip('The planning mode button displays the planning mode box when clicked', () => {
  const r = mock<Recipe>();
  r.name = 'baz';
  r.id = '2';
  r.description = 'baz';
  r.shortName = '';

  render(<Recipes />);

  const planningMode = screen.getByRole('button', { name: 'Planning Mode' });

  act(() => {
    userEvent.click(planningMode);
  });

  defaultDeliveryDays.forEach((_, index) => {
    expect(screen.queryByText(`Cook ${index + 1}`)).toBeInTheDocument();
  });
});

test.skip("There is a 'cancel planning mode' button in planning mode that exits out of planning mode", () => {
  const r = mock<Recipe>();
  r.name = 'baz';
  r.id = '2';
  r.description = 'baz';
  r.shortName = '';

  render(<Recipes />);

  const planningMode = screen.getByRole('button', { name: 'Planning Mode' });

  act(() => {
    userEvent.click(planningMode);
  });

  const cancelPlanningMode = screen.getByRole('button', {
    name: 'Cancel'
  });

  act(() => {
    userEvent.click(cancelPlanningMode);
  });

  defaultDeliveryDays.forEach((_, index) => {
    expect(screen.queryByText(`Cook ${index + 1}`)).not.toBeInTheDocument();
  });
});

test.skip('The planning mode button adds checkboxes for each recipe once a delivery day has been selected', () => {
  const ra = mock<Recipe>();
  ra.name = 'foo';
  ra.id = '0';
  ra.description = 'foo';
  ra.shortName = '';

  const rb = mock<Recipe>();
  rb.name = 'bar';
  rb.id = '1';
  rb.description = 'bar';
  rb.shortName = '';

  const rc = mock<Recipe>();
  rc.name = 'baz';
  rc.id = '2';
  rc.description = 'baz';
  rc.shortName = '';

  render(<Recipes />);

  const planningMode = screen.getByRole('button', { name: 'Planning Mode' });

  act(() => {
    userEvent.click(planningMode);
  });

  const rows = screen.getAllByRole('row');

  rows.forEach((row, index) => {
    if (index > 0) {
      const checkbox = within(row).queryByRole('checkbox');
      expect(checkbox).toBeNull();
    }
  });

  const deliveryOne = screen.getByRole('button', { name: 'Cook 1' });

  act(() => {
    userEvent.click(deliveryOne);
  });

  const rowsAfter = screen.getAllByRole('row');

  rowsAfter.forEach((row, index) => {
    if (index > 0) {
      const checkbox = within(row).queryByRole('checkbox');
      expect(checkbox).not.toBeNull();
    }
  });
});
