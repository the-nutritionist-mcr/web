import { Select, TableCell, ThemeContext } from "grommet";
import {
  CustomerMealsSelection,
  SelectedItem,
  SelectedMeal
} from "../../meal-planning";
import React from "react";
import Recipe from "../../domain/Recipe";
import { adjustCustomerSelection } from "./planner-reducer";
import deepMemo from "../../lib/deepMemo";
import { useDispatch } from "react-redux";
import DeliveryMealsSelection from "../../types/DeliveryMealsSelection";
import { extrasLabels, planLabels } from "../../lib/config";

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

const UnMemoizedFinalizeCell: React.FC<FinalizeCellProps> = props => {
  const dispatch = useDispatch();

  const onChange = React.useCallback(
    event => {
      // eslint-disable-next-line no-console
      console.log(event);
      dispatch(
        adjustCustomerSelection({
          index: props.index,
          deliveryIndex: props.deliveryIndex,
          customer: props.customerSelection.customer,
          recipe:
            typeof event.value === "string" ? undefined : event.value.recipe,
          variant: event.value.chosenVariant
        })
      );
    },
    [
      dispatch,
      props.customerSelection.customer,
      props.index,
      props.deliveryIndex
    ]
  );

  const options = (delivery: number) => [
    ...props.deliveryMeals[delivery].flatMap(meal =>
      planLabels.map(variant => ({ recipe: meal, chosenVariant: variant }))
    ),
    ...extrasLabels.map(label => ({ chosenVariant: label }))
  ];

  return (
    <TableCell key={props.index}>
      <ThemeContext.Extend
        value={{
          global: {
            input: {
              padding: "0",
              font: {
                weight: 400
              }
            }
          }
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
