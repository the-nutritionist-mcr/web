import { Box, Button, Select, TableCell, ThemeContext } from 'grommet';
import { Trash } from 'grommet-icons';
import React from 'react';
import deepMemo from '../../lib/deepMemo';
import { itemFamilies } from '@tnmw/config';
import {
  DeliveryItem,
  MealPlanGeneratedForIndividualCustomer,
  PlanLabels,
  PlannedCook,
  Recipe,
} from '@tnmw/types';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: PlannedCook[];
  deliveryIndex: number;
  allRecipes: Recipe[];
  customerSelection: MealPlanGeneratedForIndividualCustomer;
  selectedItem: DeliveryItem;
  onUpdate: (
    deliveryIndex: number,
    newRecipe?: Recipe,
    chosenVariant?: PlanLabels,
    itemIndex?: number
  ) => void;
}

const getSelectedItemString = (selectedItem: DeliveryItem) => {
  console.log(selectedItem);
  if (selectedItem.isExtra) {
    return selectedItem.extraName;
  }
  return `${selectedItem.recipe.shortName} (${selectedItem.chosenVariant})`;
};

const UnMemoizedFinalizeCell = (props: FinalizeCellProps) => {
  const options = (delivery: number) => [
    ...props.deliveryMeals[delivery].menu.flatMap((meal) => {
      return itemFamilies
        .filter((family) => !family.isExtra)
        .map((family) => ({
          recipe: meal,
          chosenVariant: family.name,
          isExtra: false,
        }));
    }),
    ...itemFamilies
      .filter((family) => family.isExtra)
      .map((family) => ({ extraName: family.name, isExtra: true })),
  ];

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
