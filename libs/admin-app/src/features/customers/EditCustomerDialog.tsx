import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DateInput,
  Form,
  FormField,
  Heading,
  Layer,
  Select,
  TextArea,
  TextInput,
  ThemeContext,
} from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import React from 'react';
import { debounce } from 'lodash';
import { CustomerWithChargebeePlan, Exclusion, Snack } from '@tnmw/types';
import { daysPerWeekOptions, plans } from '@tnmw/config';

interface EditCustomerDialogProps {
  customer: CustomerWithChargebeePlan;
  show?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onOk: () => void;
  title: string;
  onCancel: () => void;
  exclusions: Exclusion[];
}

const SUBMIT_DEBOUNCE = 500;

const EditCustomerDialog: React.FC<EditCustomerDialogProps> = (props) => {
  const propsCustomer = {
    ...props.customer,
  };

  const [customer, setCustomer] = React.useState(propsCustomer);

  const isLoading = false;

  const onSubmit = debounce(async (): Promise<void> => {}, SUBMIT_DEBOUNCE);

  return props?.show ? (
    <Layer>
      <Card>
        <Form
          value={customer}
          onReset={(): void => {
            setCustomer(propsCustomer);
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(nextCustomerData: any): void => {
            // eslint-disable-next-line no-console
            const nextCustomer = {
              ...nextCustomerData,
              startDate:
                nextCustomerData.startDate &&
                new Date(nextCustomerData.startDate),
              paymentDayOfMonth:
                nextCustomerData.paymentDayOfMonth === ''
                  ? undefined
                  : nextCustomerData.paymentDayOfMonth,
            };

            setCustomer(nextCustomer);
          }}
          onSubmit={onSubmit}
        >
          <CardHeader margin="none" pad="medium" alignSelf="center">
            <Heading margin="none" level={3}>
              {props.title}
            </Heading>
          </CardHeader>
          <CardBody pad="medium" alignSelf="center">
            <Box direction="row" gap="medium">
              <Box direction="column">
                <FormField name="salutation" label="Salutation" required>
                  <Select
                    options={[
                      'Mr',
                      'Mrs',
                      'Miss',
                      'Ms',
                      'Mx',
                      'Master',
                      'Dr',
                      'Prof',
                      'Other',
                    ]}
                    name="salutation"
                  />
                </FormField>
                <FormField name="firstName" label="First Name" required>
                  <TextInput name="firstName" />
                </FormField>

                <FormField name="surname" label="Surname" required>
                  <TextInput name="surname" />
                </FormField>

                <FormField name="paymentDayOfMonth" label="Payment Day ">
                  <TextInput name="paymentDayOfMonth" type="number" />
                </FormField>
              </Box>
              <Box direction="column">
                <FormField name="startDate" label="Start Date">
                  <DateInput name="startDate" format="dd/mm/yyyy" />
                </FormField>
                <FormField name="telephone" label="Telephone">
                  <TextInput name="telephone" type="tel" />
                </FormField>
                <FormField name="email" label="Email" required>
                  <TextInput name="email" type="email" />
                </FormField>
                <FormField name="plan" label="Plan">
                  <Select
                    name="plan"
                    options={plans}
                    labelKey="name"
                    valueKey="name"
                  />
                </FormField>
              </Box>

              <Box direction="column">
                <FormField name="daysPerWeek" label="Days per Week">
                  <Select name="daysPerWeek" options={daysPerWeekOptions} />
                </FormField>

                <FormField name="snack" label="Snack">
                  <Select
                    name="snack"
                    options={[Snack.None, Snack.Standard, Snack.Large]}
                  />
                </FormField>

                <FormField name="breakfast" label="Breakfast">
                  <Select name="breakfast" options={['Yes', 'No']} />
                </FormField>

                <FormField name="exclusions" label="Customisations">
                  <Select
                    multiple
                    closeOnChange={false}
                    name="exclusions"
                    options={props.exclusions}
                    labelKey="name"
                    valueKey="name"
                  />
                </FormField>
              </Box>
            </Box>
            <Box direction="row" fill="horizontal" justify="stretch">
              <ThemeContext.Extend
                value={{
                  formField: {
                    extend: `
                    flex-grow: 2
                    `,
                  },
                }}
              >
                <FormField
                  name="address"
                  label="Address"
                  contentProps={{ fill: true }}
                  required
                >
                  <TextArea fill={true} name="address" />
                </FormField>
              </ThemeContext.Extend>
            </Box>

            <Box direction="row" fill="horizontal" justify="stretch">
              <ThemeContext.Extend
                value={{
                  formField: {
                    extend: `
                    flex-grow: 2
                    `,
                  },
                }}
              >
                <FormField
                  name="notes"
                  label="Notes"
                  contentProps={{ fill: true }}
                >
                  <TextArea fill={true} name="notes" />
                </FormField>
              </ThemeContext.Extend>
            </Box>
          </CardBody>

          <CardFooter pad="medium" alignSelf="center" justify="center">
            <Button
              icon={<Checkmark size="small" color="brand" />}
              disabled={isLoading}
              label="Ok"
              type="submit"
              name="submit"
            />
            <Button
              icon={<Close size="small" color="brand" />}
              onClick={props.onCancel}
              label="Cancel"
            />
            <Button type="reset" name="reset" label="Reset" />
          </CardFooter>
        </Form>
      </Card>
    </Layer>
  ) : null;
};

export default EditCustomerDialog;
