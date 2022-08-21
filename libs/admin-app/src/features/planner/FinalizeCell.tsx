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
import { cell } from './finalise.css';

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
    <ThemeContext.Extend
      value={{
        table: {
          body: {
            pad: 'small',
          },
        },
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
      <td key={props.index} className={cell}>
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
            <Text style={{ fontSize: '12px', cursor: 'not-allowed' }}>
              {props.plan.name}
            </Text>
          )}
        </Box>
      </td>
    </ThemeContext.Extend>
  );
};

const FinalizeCell = deepMemo(UnMemoizedFinalizeCell);

export default FinalizeCell;
