import {
  Box,
  Header,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'grommet';
import { Exclusion, CustomerWithChargebeePlan } from '@tnmw/types';

import CustomerRow from './CustomerRow';
import React from 'react';

interface CustomersProps {
  customers: CustomerWithChargebeePlan[];
  customisations: Exclusion[];
}

const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return (
    <React.Fragment>
      <Header
        align="center"
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Box direction="row" flex="grow" align="center" gap="small">
          <Heading level={2}>Customers</Heading>
        </Box>
      </Header>
      <Table alignSelf="start">
        <TableHeader>
          <TableRow>
            <TableCell scope="col">
              <strong>Name</strong>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            // eslint-disable-next-line fp/no-mutating-methods
            customers
              .slice()
              .reverse()
              .sort(
                (a: CustomerWithChargebeePlan, b: CustomerWithChargebeePlan) =>
                  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                  a.surname > b.surname ? 1 : -1
              )
              .map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))
          }
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default Customers;
