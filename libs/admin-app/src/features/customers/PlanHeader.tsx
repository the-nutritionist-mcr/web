import { FC } from 'react';
import { TableRow, TableCell, TableHeader } from 'grommet';
import { defaultDeliveryDays } from '@tnmw/config';

interface PlanHeaderProps {
  deliveryDays: string[];
}

const PlanHeader: FC<PlanHeaderProps> = (props) => (
  <TableHeader>
    <TableRow>
      <TableCell scope="col">
        <strong>Plan</strong>
      </TableCell>
      {defaultDeliveryDays.map((_, index) => {
        const day =
          index < props.deliveryDays.length
            ? props.deliveryDays[index]
            : '(Not chosen)';

        return (
          <TableCell key={`day-${index + 1}-header`} scope="col">
            <strong>{day}</strong>
          </TableCell>
        );
      })}
      <TableCell scope="col">
        <strong>Total</strong>
      </TableCell>
    </TableRow>
  </TableHeader>
);

export default PlanHeader;
