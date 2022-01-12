import {
  TableCell,
  TableRow,
  Text,
  base,
  Table,
  TableBody,
  TableHeader,
  Button,
  Box
} from "grommet";
import { FormAdd } from "grommet-icons";
import { CustomerMealsSelection } from "../../meal-planning";
import React from "react";
import Recipe from "../../domain/Recipe";
import deepMemo from "../../lib/deepMemo";
import styled from "styled-components";
import { batchArray } from "../../lib/batch-array";
import FinalizeCell from "./FinalizeCell";
import DeliveryMealsSelection from "../../types/DeliveryMealsSelection";
import { Link } from "react-router-dom";
import { addAdHoc } from "./planner-reducer";
import { useDispatch } from "react-redux";
import { getPlanString } from "../../lib/get-plan-string";
import {
  defaultDeliveryDays,
  extrasLabels,
  planLabels
} from "../../lib/config";

interface FinalizeRowProps {
  customerSelection: CustomerMealsSelection[number];
  deliveryMeals: DeliveryMealsSelection[];
  allRecipes: Recipe[];
  columns: number;
}

const AlternatingTableRow = styled(TableRow)`
  box-sizing: border-box;
  &:hover {
    outline: 1px solid ${base.global?.colors?.["brand"]};
  }
`;

const FinalizeCustomerTableUnMemoized: React.FC<FinalizeRowProps> = props => {
  const name = `${props.customerSelection.customer.firstName} ${props.customerSelection.customer.surname}`;

  const deliveries = props.customerSelection.deliveries ?? [];

  const planString = React.useMemo(
    () =>
      getPlanString(props.customerSelection.customer.newPlan, {
        planLabels: [...planLabels],
        extrasLabels: [...extrasLabels],
        defaultDeliveryDays: [...defaultDeliveryDays]
      }),
    [props.customerSelection.customer.newPlan]
  );

  const dispatch = useDispatch();

  return (
    <Table alignSelf="start" style={{ marginTop: "1rem" }}>
      <TableHeader>
        <TableRow>
          <TableCell colSpan={7}>
            <Box direction="row" align="end">
              <Text>
                <strong>
                  <Link
                    style={{ color: "black", textDecoration: "none" }}
                    to={`/edit-customer/${props.customerSelection.customer.id}`}
                  >
                    {name}
                  </Link>{" "}
                </strong>
                / {planString}
              </Text>
            </Box>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.flatMap((delivery, deliveryIndex) =>
          typeof delivery === "string" ? (
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
                  />
                )),
                <Button
                  key={`${props.customerSelection.customer.id}-${deliveryIndex}-add-button`}
                  icon={<FormAdd />}
                  hoverIndicator={true}
                  onClick={() =>
                    dispatch(
                      addAdHoc({
                        customer: props.customerSelection.customer,
                        deliveryIndex
                      })
                    )
                  }
                />
              ],
              props.columns
            ).map((row, batchIndex) => (
              <AlternatingTableRow
                style={{ width: "100%" }}
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
