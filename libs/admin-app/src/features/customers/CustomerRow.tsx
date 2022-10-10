import { Tag, TableCell, TableRow, Box } from 'grommet';
import { BackendCustomer } from '@tnmw/types';
import deepMemo from '../../lib/deepMemo';
import { PlanCell } from './plan-cell';
import { Link } from '../../components';
import { customerRow } from './customers.css';
import { CustomisationsCell } from './customisations-cell';

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
        <CustomisationsCell customer={props.customer} />
      </TableCell>
    </TableRow>
  );
};

const CustomerRow = deepMemo(UnMemoizedCustomerRow);

export default CustomerRow;
