import { Tag, TableCell, TableRow } from 'grommet';
import { BackendCustomer } from '@tnmw/types';
import { PlanCell } from './plan-cell';
import { Link } from '../../components';
import { customerRow } from './customers.css';
import { CustomisationsCell } from './customisations-cell';
import react from 'react';

interface CustomerRowProps {
  customer: BackendCustomer;
}

const UnMemoizedCustomerRow: React.FC<CustomerRowProps> = (props) => {
  const nameString = `${props.customer.surname}, ${props.customer.firstName}`;

  return (
    <TableRow className={customerRow}>
      <TableCell>
        <Link path={`/admin/edit-customer?userId=${props.customer.username}`}>
          {nameString}
        </Link>
      </TableCell>
      <TableCell scope="row">
        <PlanCell customer={props.customer} />
      </TableCell>
      <TableCell scope="row">
        <CustomisationsCell
          keyPrefix={props.customer.username}
          customisations={props.customer.customisations}
        />
      </TableCell>
    </TableRow>
  );
};

const CustomerRow = react.memo(
  UnMemoizedCustomerRow,
  (oldProps, newProps) =>
    oldProps.customer.username === newProps.customer.username &&
    oldProps.customer.plans.map((plan) => plan.name).join(',') ===
      newProps.customer.plans.map((plan) => plan.name).join(',') &&
    oldProps.customer.customisations
      .map((customisation) => customisation.name)
      .join(',') ===
      newProps.customer.customisations
        .map((customisation) => customisation.name)
        .join(',')
);

export default CustomerRow;
