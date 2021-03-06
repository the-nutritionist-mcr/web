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
import DeliveryMealsSelection from '../../types/DeliveryMealsSelection';
import {
  ChangePlanRecipeBody,
  PlanLabels,
  PlanResponseSelections,
  Recipe,
} from '@tnmw/types';
import { planLabels } from '@tnmw/config';

interface FinalizeRowProps {
  customerSelection: PlanResponseSelections[number];
  deliveryMeals: DeliveryMealsSelection[];
  allRecipes: Recipe[];
  columns: number;
  update: (item: ChangePlanRecipeBody) => Promise<void>;
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
    props.customerSelection.customer?.exclusions
      .map((exclusion) => exclusion.name)
      .join(', ') ?? '';
  ('');

  const onUpdate = (
    deliveryIndex: number,
    recipe?: Recipe,
    chosenVariant?: PlanLabels,
    itemIndex?: number
  ) => {
    props.update({
      selectionId: props.customerSelection.id,
      selectionSort: props.customerSelection.sort,
      chosenVariant,
      recipe,
      deliveryIndex,
      itemIndex,
    });
  };

  return (
    <Table alignSelf="start" style={{ marginTop: '1rem' }}>
      <TableHeader>
        <TableRow>
          <TableCell colSpan={7}>
            <Box direction="row" align="end">
              <Text
                color={
                  props.customerSelection.updatedByCustomer ? 'blue' : 'black'
                }
              >
                <strong>
                  <Link
                    className={
                      props.customerSelection.updatedByCustomer
                        ? modifiedCustomerLink
                        : customerLink
                    }
                    path={`/admin/edit-customer/${props.customerSelection.customer.id}`}
                  >
                    {name}
                  </Link>
                </strong>{' '}
                /{' '}
                {props.customerSelection.customer.chargebeePlan
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
          typeof delivery === 'string' ? (
            <AlternatingTableRow>
              <TableCell scope="row">
                <Text>
                  <strong>{deliveryIndex + 1}</strong>
                </Text>
              </TableCell>
              <TableCell>
                <em>{delivery}</em>
              </TableCell>
            </AlternatingTableRow>
          ) : (
            batchArray(
              [
                ...delivery.map((item, itemIndex) => (
                  <FinalizeCell
                    key={`${props.customerSelection.customer.id}-${deliveryIndex}-item-${itemIndex}`}
                    deliveryIndex={deliveryIndex}
                    index={itemIndex}
                    deliveryMeals={props.deliveryMeals}
                    allRecipes={props.allRecipes}
                    selectedItem={item}
                    customerSelection={props.customerSelection}
                    onUpdate={onUpdate}
                  />
                )),
                <Button
                  key={`${props.customerSelection.customer.id}-${deliveryIndex}-add-button`}
                  icon={<FormAdd />}
                  hoverIndicator={true}
                  onClick={() => {
                    onUpdate(
                      deliveryIndex,
                      props.deliveryMeals[deliveryIndex][0],
                      planLabels[0]
                    );
                  }}
                />,
              ],
              props.columns
            ).map((row, batchIndex) => (
              <AlternatingTableRow
                style={{ width: '100%' }}
                key={`${props.customerSelection.customer.id}-${deliveryIndex}-${batchIndex}}-row`}
              >
                <TableCell scope="row">
                  {batchIndex === 0 && (
                    <Text>
                      <strong>{deliveryIndex + 1}</strong>
                    </Text>
                  )}
                </TableCell>
                {row}
              </AlternatingTableRow>
            ))
          )
        )}
      </TableBody>
    </Table>
  );
};

const FinalizeCustomerTable = deepMemo(FinalizeCustomerTableUnMemoized);

export default FinalizeCustomerTable;
