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
  ThemeContext,
} from 'grommet';
import { Link } from '@tnmw/components';
import { Trash, FormAdd } from 'grommet-icons';
import React, { useState } from 'react';
import deepMemo from '../../lib/deepMemo';
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
    <Table alignSelf="start" style={{ marginTop: '2rem' }}>
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
        {deliveries.flatMap((delivery, deliveryIndex) =>
          delivery.plans.map((plan, planIndex) =>
            plan.status === 'active' ? (
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
                    <td scope="row" align="center" style={{ padding: 0 }}>
                      {batchIndex === 0 && (
                        <Text>
                          <Box align="center" direction="row">
                            <Box flex={{ grow: 2 }}>
                              <strong>
                                D{deliveryIndex + 1} ({plan.name})
                              </strong>
                            </Box>
                            <Button
                              key={`${props.customerSelection.customer.username}-${deliveryIndex}-${planIndex}-trash-button`}
                              icon={<Trash />}
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
                    {row}
                  </AlternatingTableRow>
                ))}
              </>
            ) : (
              <AlternatingTableRow>
                <TableCell scope="row" plain>
                  <Text>
                    <strong>
                      D{deliveryIndex + 1} ({plan.name})
                    </strong>
                  </Text>
                </TableCell>
                <TableCell scope="row">
                  <Text>{plan.status}</Text>
                </TableCell>
              </AlternatingTableRow>
            )
          )
        )}
      </TableBody>
    </Table>
  );
};

const FinalizeCustomerTable = deepMemo(FinalizeCustomerTableUnMemoized);

export default FinalizeCustomerTable;
