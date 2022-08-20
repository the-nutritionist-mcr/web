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
import { Link } from '@tnmw/components';
import { FormAdd } from 'grommet-icons';
import React from 'react';
import deepMemo from '../../lib/deepMemo';
import styled from 'styled-components';
import { batchArray } from '../../lib/batch-array';
import FinalizeCell from './FinalizeCell';
import {
  customerLink,
  modifiedCustomerLink,
} from './finalise-customer-table.css';
import {
  ChangePlanRecipeBody,
  MealPlanGeneratedForIndividualCustomer,
  MealSelectionPayload,
  PlanLabels,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { planLabels } from '@tnmw/config';
import {
  deleteRecipeInSelection,
  updateRecipeInSelection,
} from './update-recipe-in-selection';

interface FinalizeRowProps {
  customerSelection: MealPlanGeneratedForIndividualCustomer;
  deliveryMeals: PlannedCook[];
  allRecipes: Recipe[];
  columns: number;
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
}

const AlternatingTableRow = styled(TableRow)`
  box-sizing: border-box;
  &:hover {
    outline: 1px solid ${base.global?.colors?.['brand']};
  }
`;

const FinalizeCustomerTableUnMemoized: React.FC<FinalizeRowProps> = (props) => {
  const name = `${props.customerSelection.customer.firstName} ${props.customerSelection.customer.surname}`;

  const deliveries = props.customerSelection.deliveries ?? [];

  const customisationsTags =
    props.customerSelection.customer?.customisations
      .map((exclusion) => exclusion.name)
      .join(', ') ?? '';
  ('');

  return (
    <Table alignSelf="start" style={{ marginTop: '1rem' }}>
      <TableHeader>
        <TableRow>
          <TableCell colSpan={7}>
            <Box direction="row" align="end">
              <Text
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
                </strong>{' '}
                /{' '}
                {props.customerSelection.customer.plans
                  .map(
                    (plan) =>
                      `${plan.name} ${plan.itemsPerDay} (${plan.daysPerWeek} days)`
                  )
                  .join(', ')}
                {customisationsTags.length > 0 ? ' / ' : ''}
                <strong>{customisationsTags}</strong>
              </Text>
            </Box>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.flatMap((delivery, deliveryIndex) =>
          delivery.plans.map((plan, planIndex) =>
            plan.status === 'active' ? (
              <AlternatingTableRow>
                <TableCell>
                  {batchArray(
                    [
                      ...plan.meals.map((meal, itemIndex) => (
                        <FinalizeCell
                          plan={plan}
                          planIndex={0}
                          key={`${props.customerSelection.customer.username}-${deliveryIndex}-item-${itemIndex}`}
                          deliveryIndex={deliveryIndex}
                          index={0}
                          deliveryMeals={props.deliveryMeals}
                          allRecipes={props.allRecipes}
                          selectedItem={meal}
                          customerSelection={props.customerSelection}
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
                    <>
                      <TableCell scope="row">
                        {batchIndex === 0 && (
                          <Text>
                            <strong>
                              D{deliveryIndex + 1} ({plan.name})
                            </strong>
                          </Text>
                        )}
                      </TableCell>
                      {row}
                    </>
                  ))}
                </TableCell>
              </AlternatingTableRow>
            ) : (
              <AlternatingTableRow>
                <TableCell scope="row">
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
