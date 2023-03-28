import {
  TableCell,
  TableRow,
  Text,
  base,
  Table,
  TableBody,
  TableHeader,
  Button,
  Box,
} from 'grommet';
import { cell } from './finalise.css';
import { Link } from '@tnmw/components';
import { Trash, FormAdd } from 'grommet-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { batchArray } from '../../lib/batch-array';
import FinalizeCell from './FinalizeCell';
import { UpdatePlanRowDialog } from './UpdatePlanRowDialog';
import {
  customerLink,
  modifiedCustomerLink,
  subheading,
} from './finalise-customer-table.css';
import {
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlannedDelivery,
  PlanWithMeals,
  Recipe,
} from '@tnmw/types';
import {
  addPlanRowToDelivery,
  addRecipeToSelection,
  deleteRecipeInSelection,
  removePlanRowFromDelivery,
  updateRecipeInSelection,
} from './update-recipe-in-selection';
import { itemFamilies } from '@tnmw/config';

interface FinalizeRowProps {
  customerSelection: MealPlanGeneratedForIndividualCustomer;
  deliveryMeals: PlannedCook[];
  allRecipes: Recipe[];
  columns: number;
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
}

const planIsEqual = (plan: PlanWithMeals, otherPlan: PlanWithMeals) => {
  if (plan.status !== otherPlan.status) {
    return false;
  }

  if (plan.status === 'active' && otherPlan.status === 'active') {
    if (plan.meals.length !== otherPlan.meals.length) {
      return false;
    }

    return plan.meals.every((meal, index) => {
      const otherMeal = otherPlan.meals[index];

      if (meal.isExtra !== otherMeal.isExtra) {
        return false;
      }

      if (meal.isExtra && otherMeal.isExtra) {
        return meal.extraName !== otherMeal.extraName;
      }

      if (!meal.isExtra && !otherMeal.isExtra) {
        return meal.recipe.id !== otherMeal.recipe.id;
      }
      return true;
    });
  }

  return true;
};

const deliveryIsEqual = (
  delivery: PlannedDelivery,
  otherDelivery: PlannedDelivery
) => {
  const bothActive = !delivery.paused && !otherDelivery.paused;

  if (!bothActive) {
    return false;
  }

  if (delivery.plans.length !== otherDelivery.plans.length) {
    return false;
  }

  if (delivery.dateCooked.toString() !== otherDelivery.dateCooked.toString()) {
    return false;
  }

  if (
    !delivery.plans.every((plan, index) =>
      planIsEqual(plan, otherDelivery.plans[index])
    )
  ) {
    return false;
  }

  return true;
};

const customerPlanIsEqual = (
  selectionOne: MealPlanGeneratedForIndividualCustomer,
  selectionTwo: MealPlanGeneratedForIndividualCustomer
) => {
  if (selectionOne.customer.username !== selectionTwo.customer.username) {
    return false;
  }

  if (selectionOne.deliveries.length !== selectionTwo.deliveries.length) {
    return false;
  }

  if (selectionOne.wasUpdatedByCustomer !== selectionTwo.wasUpdatedByCustomer) {
    return false;
  }

  if (
    !selectionOne.deliveries.every((delivery, index) =>
      deliveryIsEqual(delivery, selectionTwo.deliveries[index])
    )
  ) {
    return false;
  }

  return true;
};

const AlternatingTableRow = styled(TableRow)`
  box-sizing: border-box;
  padding: 0;
  &:hover {
    outline: 1px solid ${base.global?.colors?.['brand']};
  }
`;

const FinalizeCustomerTableUnMemoized: React.FC<FinalizeRowProps> = (props) => {
  const name = `${props.customerSelection.customer.firstName} ${props.customerSelection.customer.surname}`;

  const [showAddPlanRowDialog, setShowAddPlanRowDialog] = useState(false);

  const deliveries = props.customerSelection.deliveries ?? [];

  const customisationsTags =
    props.customerSelection.customer?.customisations
      .map((exclusion) => exclusion.name)
      .join(', ') ?? '';
  ('');

  return (
    <Table
      alignSelf="start"
      style={{ marginTop: '2rem', tableLayout: 'fixed' }}
    >
      {showAddPlanRowDialog && (
        <UpdatePlanRowDialog
          options={itemFamilies.map((family) => family.name)}
          onUpdate={(option, delivery) => {
            setShowAddPlanRowDialog(false);
            props.update(
              addPlanRowToDelivery(props.customerSelection, delivery, option)
            );
          }}
          onClose={() => setShowAddPlanRowDialog(false)}
        />
      )}
      <TableHeader>
        <TableRow>
          <TableCell colSpan={props.columns + 1}>
            <Box direction="column">
              <Box direction="row" gap="large" align="center">
                <Text
                  style={{ display: 'block' }}
                  color={
                    props.customerSelection.wasUpdatedByCustomer
                      ? 'blue'
                      : 'black'
                  }
                >
                  <strong>
                    <Link
                      className={
                        props.customerSelection.wasUpdatedByCustomer
                          ? modifiedCustomerLink
                          : customerLink
                      }
                      path={`/admin/edit-customer?userId=${props.customerSelection.customer.username}`}
                    >
                      {name}
                    </Link>
                  </strong>
                </Text>
                <Button
                  label="Add Plan Row"
                  size="small"
                  onClick={() => setShowAddPlanRowDialog(true)}
                />
              </Box>

              <Box>
                <span className={subheading}>
                  {props.customerSelection.customer.plans
                    .map(
                      (plan) =>
                        `${plan.name} ${plan.itemsPerDay} (${plan.daysPerWeek} days)`
                    )
                    .join(', ')}
                  {customisationsTags.length > 0 ? ' / ' : ''}
                  <strong>{customisationsTags}</strong>
                </span>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.flatMap((delivery, deliveryIndex) => {
          if (delivery.paused) {
            return (
              <AlternatingTableRow>
                <td style={{ padding: 0, color: 'grey' }}>
                  <Text>
                    <Box justify="start" align="center" direction="row">
                      <strong style={{ flexGrow: 2, textAlign: 'left' }}>
                        D{deliveryIndex + 1}
                      </strong>
                    </Box>
                  </Text>
                </td>
                <td style={{ padding: '6px', color: 'grey' }}>
                  <Text>Paused</Text>
                </td>
              </AlternatingTableRow>
            );
          }
          return delivery.plans.map((plan, planIndex) => {
            if (plan.status === 'cancelled') {
              return null;
            }
            return plan.status === 'active' ? (
              <>
                {batchArray(
                  [
                    ...plan.meals.map((meal, itemIndex) => (
                      <FinalizeCell
                        customer={props.customerSelection.customer}
                        recipes={props.allRecipes}
                        plan={plan}
                        key={`${props.customerSelection.customer.username}-${deliveryIndex}-item-${itemIndex}`}
                        deliveryIndex={deliveryIndex}
                        index={0}
                        deliveryMeals={props.deliveryMeals}
                        selectedItem={meal}
                        onDelete={() =>
                          props.update(
                            deleteRecipeInSelection(
                              props.customerSelection,
                              deliveryIndex,
                              planIndex,
                              itemIndex
                            )
                          )
                        }
                        onChangeRecipe={(recipe) =>
                          props.update(
                            updateRecipeInSelection(
                              props.customerSelection,
                              recipe,
                              deliveryIndex,
                              planIndex,
                              itemIndex
                            )
                          )
                        }
                      />
                    )),
                  ],
                  props.columns
                ).map((row, batchIndex) => (
                  <AlternatingTableRow>
                    <td style={{ padding: 0 }}>
                      {batchIndex === 0 && (
                        <Text>
                          <Box justify="start" align="center" direction="row">
                            <strong style={{ flexGrow: 2, textAlign: 'left' }}>
                              D{deliveryIndex + 1} ({plan.name})
                            </strong>
                            <Button
                              key={`${props.customerSelection.customer.username}-${deliveryIndex}-${planIndex}-trash-button`}
                              icon={<Trash />}
                              a11yTitle="Delete Row"
                              size="small"
                              hoverIndicator={true}
                              onClick={() =>
                                props.update(
                                  removePlanRowFromDelivery(
                                    props.customerSelection,
                                    deliveryIndex,
                                    planIndex
                                  )
                                )
                              }
                            />
                            <Button
                              key={`${props.customerSelection.customer.username}-${deliveryIndex}-${planIndex}-add-button`}
                              a11yTitle="Add Meal"
                              icon={<FormAdd />}
                              hoverIndicator={true}
                              onClick={() =>
                                props.update(
                                  addRecipeToSelection(
                                    props.customerSelection,
                                    deliveryIndex,
                                    planIndex,
                                    plan.name,
                                    !plan.isExtra
                                      ? props.deliveryMeals[deliveryIndex]
                                          .menu[0]
                                      : undefined
                                  )
                                )
                              }
                            />
                          </Box>
                        </Text>
                      )}
                    </td>
                    {row.length < props.columns
                      ? [
                          ...row,
                          Array.from({
                            length: props.columns - row.length,
                          }).map(() => <td className={cell}></td>),
                        ]
                      : row}
                  </AlternatingTableRow>
                ))}
              </>
            ) : (
              <AlternatingTableRow>
                <td style={{ padding: 0, color: 'grey' }}>
                  <Text>
                    <Box justify="start" align="center" direction="row">
                      <strong style={{ flexGrow: 2, textAlign: 'left' }}>
                        D{deliveryIndex + 1} ({plan.name})
                      </strong>
                    </Box>
                  </Text>
                </td>
                <td style={{ padding: '6px', color: 'grey' }}>
                  <Text>{plan.status}</Text>
                </td>
              </AlternatingTableRow>
            );
          });
        })}
      </TableBody>
    </Table>
  );
};

const FinalizeCustomerTable = React.memo(
  FinalizeCustomerTableUnMemoized,
  (oldProps, newProps) =>
    customerPlanIsEqual(oldProps.customerSelection, newProps.customerSelection)
);

export default FinalizeCustomerTable;
