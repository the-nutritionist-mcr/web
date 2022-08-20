import { Box, Button, Select, TableCell, ThemeContext } from 'grommet';
import { Trash } from 'grommet-icons';
import React from 'react';
import deepMemo from '../../lib/deepMemo';
import { itemFamilies } from '@tnmw/config';
import {
  ActivePlanWithMeals,
  DeliveryItem,
  MealPlanGeneratedForIndividualCustomer,
  PlanLabels,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { SelectedItem } from '@tnmw/meal-planning';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: PlannedCook[];
  deliveryIndex: number;
  allRecipes: Recipe[];
  customerSelection: MealPlanGeneratedForIndividualCustomer;
  selectedItem: DeliveryItem;
  plan: ActivePlanWithMeals;
  planIndex: number;
  onChangeRecipe: (recipe: Recipe) => void;
  onDelete: () => void;
}

const getSelectedItemString = (
  selectedItem: DeliveryItem & { name: string }
) => {
  if (selectedItem.isExtra) {
    return selectedItem.name;
  }
  return `${selectedItem.recipe.shortName} (${selectedItem.name})`;
};

const UnMemoizedFinalizeCell = (props: FinalizeCellProps) => {
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
            onClick={props.onDelete}
          />
          {!props.selectedItem.isExtra ? (
            <Select
              plain
              size="xsmall"
              options={props.deliveryMeals[props.deliveryIndex].menu}
              placeholder="None"
              labelKey={'name'}
              valueKey={'name'}
              value={props.selectedItem.recipe}
              onChange={(event) => {
                props.onChangeRecipe(event.value);
              }}
            />
          ) : (
            props.plan.name
          )}
        </Box>
      </ThemeContext.Extend>
    </TableCell>
  );
};

const FinalizeCell = deepMemo(UnMemoizedFinalizeCell);

export default FinalizeCell;
