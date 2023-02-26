import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  Heading,
  Layer,
  Select,
  TextInput,
} from 'grommet';

import {
  BackendCustomer,
  Exclusion,
  MealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import { v4 } from 'uuid';
import { TagInput } from '../../components';

interface AddAdHocRowDialogProps {
  onOk: (customer: MealPlanGeneratedForIndividualCustomer) => void;
  onCancel: () => void;
  customisations: Exclusion[];
}

export const defaultCustomer = (): BackendCustomer => ({
  groups: [],
  username: v4(),
  country: '',
  deliveryDay1: '',
  deliveryDay2: '',
  deliveryDay3: '',
  customerUpdateTime: '',
  deliveryNotes: '',
  addressLine1: '',
  addressLine2: '',
  phoneNumber: '',
  addressLine3: '',
  subscriptionUpdateTime: '',
  firstName: '',
  surname: '',
  salutation: '',
  email: '',
  city: '',
  postcode: '',
  plans: [
    {
      termEnd: 0,
      subscriptionStatus: 'active',
      id: '1',
      name: 'Adhoc',
      daysPerWeek: 0,
      itemsPerDay: 0,
      isExtra: false,
      totalMeals: 0,
    },
  ],
  customisations: [],
});

export const AddAdHocRowDialog = (props: AddAdHocRowDialogProps) => {
  const [customer, setCustomer] = useState(defaultCustomer());
  return (
    <Layer>
      <Card>
        <Form
          value={customer}
          onChange={(data: BackendCustomer) => {
            setCustomer(data);
          }}
          onSubmit={() => {
            props.onOk({
              sortingPriority: true,
              wasUpdatedByCustomer: false,
              deliveries: [
                {
                  dateCooked: new Date(),
                  plans: [],
                },
                {
                  dateCooked: new Date(),
                  plans: [],
                },
              ],
              customer,
            });
          }}
        >
          <CardHeader margin="none" pad="medium">
            <Heading level={3} margin="none">
              Add Add-hoc Row
            </Heading>
          </CardHeader>

          <CardBody
            margin="none"
            pad="medium"
            gap="medium"
            align="center"
            width="400px"
          >
            <FormField
              label="First Name"
              name="firstName"
              required
              width="100%"
            >
              <TextInput name="firstName" />
            </FormField>
            <FormField label="Surname" name="surname" required width="100%">
              <TextInput name="surname" />
            </FormField>

            <Box width="100%">
              <Heading level={3}>Customisations</Heading>
              <TagInput
                options={props.customisations.map((exclusion) => ({
                  key: exclusion.id,
                  label: exclusion.name,
                }))}
                onChange={(values) => {
                  setCustomer({
                    ...customer,
                    customisations: values
                      .map((value) =>
                        props.customisations.find(
                          (exclusion) => exclusion.id === value.key
                        )
                      )
                      .flatMap((value) => (value ? [value] : [])),
                  });
                }}
                values={customer.customisations.map((exclusion) => ({
                  key: exclusion.id,
                  label: exclusion.name,
                }))}
              />
            </Box>
          </CardBody>

          <CardFooter pad="small" alignSelf="center" justify="center">
            <Button label="OK" type="submit" />
            <Button label="Cancel" onClick={props.onCancel} />
          </CardFooter>
        </Form>
      </Card>
    </Layer>
  );
};
