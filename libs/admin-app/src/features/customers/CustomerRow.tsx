import { Box, Button, TableCell, TableRow } from 'grommet';
import { Pause, Play, Trash } from 'grommet-icons';
import { OkCancelDialog, PauseDialog } from '../../components';
import { Link } from 'react-router-dom';
import Customer from '../../domain/Customer';
import EditCustomerDialog from './EditCustomerDialog';
import React from 'react';
import getExtrasString from '../../lib/getExtrasString';
import getStatusString from '../../lib/getStatusString';
import styled from 'styled-components';
import {
  defaultDeliveryDays,
  planLabels,
  extrasLabels,
} from '../../lib/config';
import deepMemo from '../../lib/deepMemo';
import { getPlanString } from '../../lib/get-plan-string';

interface CustomerRowProps {
  customer: Customer;
}

const SlimButton = styled(Button)`
  padding: 0 5px 0 5px;
`;

const UnMemoizedCustomerRow: React.FC<CustomerRowProps> = (props) => {
  const [showDoDelete, setShowDoDelete] = React.useState(false);
  const [showPause, setShowPause] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);

  const nameString = `${props.customer.surname} ${props.customer.firstName} (${props.customer.salutation})`;
  const statusString = React.useMemo(
    () => getStatusString(props.customer),
    [props.customer]
  );

  const planString = React.useMemo(
    () =>
      getPlanString(props.customer.newPlan, {
        planLabels: [...planLabels],
        extrasLabels: [...extrasLabels],
        defaultDeliveryDays: [...defaultDeliveryDays],
      }),
    [props.customer]
  );

  return (
    <TableRow>
      <TableCell scope="row">
        <Link to={`/edit-customer/${props.customer.id}`}>{nameString}</Link>
      </TableCell>
      <TableCell>{statusString}</TableCell>
      <TableCell>{planString}</TableCell>
      <TableCell>{getExtrasString(props.customer)}</TableCell>
      <TableCell>
        {props.customer.exclusions.length > 0
          ? props.customer.exclusions
              .map((exclusion) => exclusion.name)
              .join(', ')
          : 'None'}
      </TableCell>
      <TableCell>
        <Box direction="row">
          <SlimButton
            secondary
            onClick={(): void => setShowDoDelete(true)}
            icon={<Trash color="light-6" />}
            a11yTitle="Delete"
          />
          <OkCancelDialog
            show={showDoDelete}
            header="Are you sure?"
            thing={props.customer}
            onOk={(): void => {
              setShowDoDelete(false);
            }}
            onCancel={(): void => setShowDoDelete(false)}
          >
            Are you sure you want to delete this customer?
          </OkCancelDialog>
          <SlimButton
            secondary
            icon={<Pause color="light-6" />}
            a11yTitle="Pause"
            onClick={(): void => setShowPause(true)}
          />
          <PauseDialog
            customer={props.customer}
            show={showPause}
            onCancel={(): void => {
              setShowPause(false);
            }}
            onOk={(): void => {
              setShowPause(false);
            }}
          />
          <SlimButton
            secondary
            icon={<Play color="light-6" />}
            a11yTitle="Remove pause"
            onClick={() => {
              const customer = {
                ...props.customer,
                pauseStart: undefined,
                pauseEnd: undefined,
              };
            }}
          />
          <EditCustomerDialog
            title="Edit Customer"
            customer={props.customer}
            show={showEdit}
            exclusions={[]}
            onOk={(): void => {
              setShowEdit(false);
            }}
            onCancel={(): void => {
              setShowEdit(false);
            }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

const CustomerRow = deepMemo(UnMemoizedCustomerRow);

export default CustomerRow;
