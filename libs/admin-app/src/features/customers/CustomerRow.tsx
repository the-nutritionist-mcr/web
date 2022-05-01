import { TableCell, TableRow } from 'grommet';
import { CustomerWithChargebeePlan } from '@tnmw/types';
import React from 'react';
import deepMemo from '../../lib/deepMemo';

interface CustomerRowProps {
  customer: CustomerWithChargebeePlan;
}

const UnMemoizedCustomerRow: React.FC<CustomerRowProps> = (props) => {
  const nameString = `${props.customer.surname} ${props.customer.firstName} (${props.customer.salutation})`;

  return (
    <TableRow>
      <TableCell scope="row">
        <a href={`/admin/edit-customer/${props.customer.id}`}>{nameString}</a>
      </TableCell>
    </TableRow>
  );
};

const CustomerRow = deepMemo(UnMemoizedCustomerRow);

export default CustomerRow;
