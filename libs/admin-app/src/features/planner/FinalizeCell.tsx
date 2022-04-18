import { Select, TableCell, ThemeContext } from 'grommet';
import React from 'react';
import deepMemo from '../../lib/deepMemo';
import { extrasLabels, planLabels } from '@tnmw/config';
import {
  CustomerMealsSelection,
  SelectedItem,
  Recipe,
  DeliveryMealsSelection,
} from '@tnmw/types';
import { SelectedMeal } from '@tnmw/meal-planning';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: DeliveryMealsSelection[];
  deliveryIndex: number;
  allRecipes: Recipe[];
  customerSelection: CustomerMealsSelection[number];
  selectedItem: SelectedItem;
}

const isSelectedMeal = (
  selectedItem: SelectedItem
): selectedItem is SelectedMeal =>
  Boolean((selectedItem as SelectedMeal).recipe);

const getSelectedItemString = (selectedItem: SelectedItem) => {
  if (isSelectedMeal(selectedItem)) {
    return `${selectedItem.recipe.shortName} (${selectedItem.chosenVariant})`;
  }
  return selectedItem.chosenVariant;
};

const UnMemoizedFinalizeCell: React.FC<FinalizeCellProps> = (props) => {
  const onChange = React.useCallback(
    (event) => {
      // eslint-disable-next-line no-console
      console.log(event);
    },
    [props.customerSelection.customer, props.index, props.deliveryIndex]
  );

  const options = (delivery: number) => [
    ...props.deliveryMeals[delivery].flatMap((meal) =>
      planLabels.map((variant) => ({ recipe: meal, chosenVariant: variant }))
    ),
    ...extrasLabels.map((label) => ({ chosenVariant: label })),
  ];

  return (
    <TableCell key={props.index}>
      <ThemeContext.Extend
        value={{
          global: {
            input: {
              padding: '0',
              font: {
                weight: 400,
              },
            },
          },
        }}
      >
        <Select
          plain
          size="xsmall"
          options={options(props.deliveryIndex)}
          placeholder="None"
          labelKey={getSelectedItemString}
          valueKey={getSelectedItemString}
          value={props.selectedItem}
          onChange={onChange}
        />
      </ThemeContext.Extend>
    </TableCell>
  );
};

const FinalizeCell = deepMemo(UnMemoizedFinalizeCell);

export default FinalizeCell;
