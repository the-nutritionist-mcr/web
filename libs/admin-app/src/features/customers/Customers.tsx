import {
  Box,
  Button,
  Header,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import Customer, { Snack } from "../../domain/Customer";

import { daysPerWeekOptions, plans } from "../../lib/config";
import CustomerRow from "./CustomerRow";
import EditCustomerDialog from "./EditCustomerDialog";
import React from "react";
import fileDownload from "js-file-download";
import generateCsvStringFromObjectArray from "../../lib/generateCsvStringFromObjectArray";
import { useHistory } from "react-router-dom";
import Exclusion from "../../domain/Exclusion";

const convertCustomerToSimpleObject = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { newPlan, ...customer }: Customer
): { [key: string]: string | number | boolean | undefined } => ({
  ...customer,
  plan: customer.plan.name,
  exclusions: customer.exclusions.map((exclusion) => exclusion.name).join(","),
});

interface CustomersProps {
  customers: Customer[]
  customisations: Exclusion[]
}

const Customers: React.FC<CustomersProps> = ({customers, customisations}) => {
  const [showCreateCustomer, setShowCreateCustomer] = React.useState(false);

  const exclusions = customisations

  const history = useHistory();

  return (
    <React.Fragment>
      <Header align="center" justify="start" gap="small">
        <Box direction="row" flex="grow" align="center" gap="small">
          <Heading level={2}>Customers</Heading>
          <Button
            primary
            size="small"
            onClick={() => history.push("/new-customer")}
            label="New"
            a11yTitle="New Customer"
          />
          <Button
            primary
            size="small"
            label="Download CSV"
            onClick={(): void => {
              const string = generateCsvStringFromObjectArray(
                customers.map(convertCustomerToSimpleObject)
              );
              fileDownload(string, "customers.csv");
            }}
          />
          {showCreateCustomer && (
            <EditCustomerDialog
              exclusions={exclusions}
              title="Create New Customer"
              customer={{
                id: "0",
                firstName: "",
                surname: "",
                salutation: "",
                telephone: "",
                address: "",
                notes: "",
                email: "",
                daysPerWeek: daysPerWeekOptions[0],
                plan: plans[0],
                snack: Snack.None,
                breakfast: false,
                exclusions: [],
              }}
              show={showCreateCustomer}
              onOk={(): void => {
                setShowCreateCustomer(false);
              }}
              onCancel={(): void => {
                setShowCreateCustomer(false);
              }}
            />
          )}
        </Box>
      </Header>
        <Table alignSelf="start">
          <TableHeader>
            <TableRow>
              <TableCell scope="col">
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell scope="col">
                <strong>Plan</strong>
              </TableCell>
              <TableCell scope="col">
                <strong>Extras</strong>
              </TableCell>
              <TableCell scope="col">
                <strong>Customisations</strong>
              </TableCell>
              <TableCell scope="col">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers
              .slice()
              .reverse()
              .sort((a: Customer, b: Customer) =>
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                a.surname > b.surname ? 1 : -1
              )
              .map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))}
          </TableBody>
        </Table>
    </React.Fragment>
  );
};

export default Customers;
