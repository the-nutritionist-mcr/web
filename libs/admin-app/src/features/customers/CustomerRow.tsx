import { TableCell, TableRow } from 'grommet';
import { CustomerWithChargebeePlan } from '@tnmw/types';
import React, { useContext } from 'react';
import deepMemo from '../../lib/deepMemo';
import { Link } from '../../components';

interface CustomerRowProps {
  customer: CustomerWithChargebeePlan;
}

const UnMemoizedCustomerRow: React.FC<CustomerRowProps> = (props) => {
  const nameString = `${props.customer.surname}, ${props.customer.firstName}`;

  return (
    <TableRow>
      <TableCell>
        <Link path={`/admin/edit-customer?userId=${props.customer.id}`}>
          {nameString}
        </Link>
      </TableCell>
      <TableCell scope="row">{props.customer.email}</TableCell>
    </TableRow>
  );
};

const CustomerRow = deepMemo(UnMemoizedCustomerRow);

export default CustomerRow;
