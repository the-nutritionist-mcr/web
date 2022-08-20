import { Text, Box, Button, Select, TableCell, ThemeContext } from 'grommet';
import { Trash } from 'grommet-icons';
import deepMemo from '../../lib/deepMemo';
import {
  ActivePlanWithMeals,
  DeliveryItem,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: PlannedCook[];
  deliveryIndex: number;
  selectedItem: DeliveryItem;
  plan: ActivePlanWithMeals;
  onChangeRecipe: (recipe: Recipe) => void;
  onDelete: () => void;
}

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
        <Box direction="row" align="center">
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
            <Text style={{ fontSize: '12px' }}>{props.plan.name}</Text>
          )}
        </Box>
      </ThemeContext.Extend>
    </TableCell>
  );
};

const FinalizeCell = deepMemo(UnMemoizedFinalizeCell);

export default FinalizeCell;
