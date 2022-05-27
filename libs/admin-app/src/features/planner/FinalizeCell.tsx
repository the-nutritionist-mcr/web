import { Box, Button, Select, TableCell, ThemeContext } from 'grommet';
import { Trash } from 'grommet-icons';
import React from 'react';
import deepMemo from '../../lib/deepMemo';
import { extrasLabels, itemFamilies, planLabels } from '@tnmw/config';
import {
  SelectedItem,
  Recipe,
  DeliveryMealsSelection,
  CustomerMealsSelectionWithChargebeeCustomer,
  PlanLabels,
} from '@tnmw/types';
import { SelectedMeal } from '@tnmw/meal-planning';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: DeliveryMealsSelection[];
  deliveryIndex: number;
  allRecipes: Recipe[];
  customerSelection: CustomerMealsSelectionWithChargebeeCustomer[number];
  selectedItem: SelectedItem;
  onUpdate: (
    deliveryIndex: number,
    newRecipe?: Recipe,
    chosenVariant?: PlanLabels,
    itemIndex?: number
  ) => void;
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
      props.onUpdate(
        props.deliveryIndex,
        event.value.recipe,
        event.value.chosenVariant,
        props.index
      );
    },
    [props.customerSelection.customer, props.index, props.deliveryIndex]
  );

  const options = (delivery: number) => [
    ...props.deliveryMeals[delivery].flatMap((meal) =>
      itemFamilies
        .filter((family) => !family.isExtra)
        .map((family) => ({
          recipe: meal,
          chosenVariant: family.name,
        }))
    ),
    ...itemFamilies
      .filter((family) => family.isExtra)
      .map((family) => ({ chosenVariant: family.name })),
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
        <Box direction="row">
          <Button
            hoverIndicator
            icon={<Trash size="small" />}
            onClick={() => {
              props.onUpdate(
                props.deliveryIndex,
                undefined,
                undefined,
                props.index
              );
            }}
          />
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
        </Box>
      </ThemeContext.Extend>
    </TableCell>
  );
};

const FinalizeCell = deepMemo(UnMemoizedFinalizeCell);

export default FinalizeCell;
