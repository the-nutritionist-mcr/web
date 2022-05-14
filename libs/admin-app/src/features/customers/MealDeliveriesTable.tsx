import { FC } from 'react';
import { Table, TableBody } from 'grommet';
import PlanRow from './PlanRow';
import PlanHeader from './PlanHeader';
import { PlannerConfig, Delivery } from '@tnmw/types';

interface PlanTableProps {
  onChange: (deliveries: Delivery[]) => void;
  deliveries: Delivery[];
  plannerConfig: PlannerConfig;
  deliveryDays: string[];
}

const MealDeliveriesTable: FC<PlanTableProps> = (props) => {
  const changeItemsQuantities = (
    planString: string,
    newQuantities: number[]
  ) => {
    const newDeliveries = props.deliveries.map((delivery, index) => ({
      ...delivery,
      items: delivery.items.map((item) =>
        item.name === planString
          ? { ...item, quantity: newQuantities[index] }
          : item
      ),
    }));

    props.onChange(newDeliveries);
  };

  const changeExtrasQuantities = (
    planString: string,
    newQuantities: number[]
  ) => {
    const newDeliveries = props.deliveries.map((delivery, index) => ({
      ...delivery,
      extras: delivery.extras.map((extra) =>
        extra.name === planString
          ? { ...extra, quantity: newQuantities[index] }
          : extra
      ),
    }));

    props.onChange(newDeliveries);
  };

  return (
    <Table>
      <PlanHeader deliveryDays={props.deliveryDays} />
      <TableBody>
        {props.plannerConfig.planLabels.map((label) => (
          <PlanRow
            key={label}
            onChange={changeItemsQuantities}
            plan={label}
            quantities={props.deliveries.map(
              (delivery) =>
                delivery.items.find((item) => item.name === label)?.quantity ??
                0
            )}
            defaultDeliveryDays={props.plannerConfig.defaultDeliveryDays}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default MealDeliveriesTable;
