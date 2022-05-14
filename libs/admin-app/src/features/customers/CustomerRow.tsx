import { TableCell, TableRow } from 'grommet';
import { CustomerWithChargebeePlan } from '@tnmw/types';
import React, { useContext } from 'react';
import deepMemo from '../../lib/deepMemo';
import { NavigationContext } from '@tnmw/utils';
import { Link } from '../../components';

interface CustomerRowProps {
  customer: CustomerWithChargebeePlan;
}

const UnMemoizedCustomerRow: React.FC<CustomerRowProps> = (props) => {
  const { navigate } = useContext(NavigationContext);
  const nameString = `${props.customer.surname} ${props.customer.firstName} (${props.customer.salutation})`;

  return (
    <TableRow>
      <TableCell scope="row">
        <Link path={`/admin/edit-customer/${props.customer.id}`}>
          {nameString}
        </Link>
      </TableCell>
    </TableRow>
  );
};

const CustomerRow = deepMemo(UnMemoizedCustomerRow);

export default CustomerRow;
