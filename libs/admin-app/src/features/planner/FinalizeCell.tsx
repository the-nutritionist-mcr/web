import { Text, Box, Button, Select, TableCell, ThemeContext } from 'grommet';
import { Trash } from 'grommet-icons';
import {
  ActivePlanWithMeals,
  BackendCustomer,
  DeliveryItem,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { cell } from './finalise.css';
import { getRealRecipe } from '@tnmw/meal-planning';
import { useEffect, useState } from 'react';

interface FinalizeCellProps {
  index: number;
  deliveryMeals: PlannedCook[];
  deliveryIndex: number;
  selectedItem: DeliveryItem;
  plan: ActivePlanWithMeals;
  onChangeRecipe: (recipe: Recipe) => void;
  onDelete: () => void;
  customer: BackendCustomer;
  recipes: Recipe[];
}

const FinalizeCell = (props: FinalizeCellProps) => {
  const renderEntry = (recipe: Recipe) => {
    const realRecipe = getRealRecipe(recipe, props.customer, props.recipes);
    const isAlternate = realRecipe.name !== realRecipe.originalName;
    return (
      <Box>
        <Text
          style={{
            padding: '6px',
            fontSize: '12px',
            color: isAlternate ? `green` : 'black',
          }}
        >
          {realRecipe.name}
        </Text>
      </Box>
    );
  };

  const recipe = !props.selectedItem.isExtra
    ? props.selectedItem.recipe
    : undefined;

  const [cellValue, setCellValue] = useState(recipe);

  useEffect(() => {
    setCellValue(recipe);
  }, [recipe]);

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
            a11yTitle="Delete"
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
              valueLabel={renderEntry}
              value={cellValue}
              onChange={(event) => {
                setCellValue(event.value);
                props.onChangeRecipe(event.value);
              }}
            >
              {renderEntry}
            </Select>
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

export default FinalizeCell;
