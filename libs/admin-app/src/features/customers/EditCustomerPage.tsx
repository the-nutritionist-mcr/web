import { Form, Header, Heading, Button, Paragraph, Select, Box } from 'grommet';
import React, { FC } from 'react';
import { FormField, Text } from 'grommet';
import {
  planLabels,
  extrasLabels,
  defaultDeliveryDays,
  itemFamilies,
} from '@tnmw/config';
import { convertPlanFormat } from '@tnmw/utils';
import { debounce, update } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog } from '../../components';
import EditCustomerDetailsPanel from './EditCustomerDetailsPanel';
import { BackendCustomer, Exclusion, UpdateCustomerBody } from '@tnmw/types';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: BackendCustomer;
  customisations: Exclusion[];
  dirty: boolean;
  updateCustomer: (details: UpdateCustomerBody) => void;
  saveCustomer: (details: UpdateCustomerBody) => void;
}

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer,
  updateCustomer,
  saveCustomer,
}) => {
  const [dirty, setDirty] = React.useState(false);
  const [planChanged, setPlanChanged] = React.useState(false);
  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const onSubmit = debounce(async () => {
    saveCustomer({
      customisations: customer.customisations,
      customPlan: customer.customPlan ? customer.customPlan : undefined,
    });

    setDirty(false);
    setPlanChanged(false);
    setShowPlanChangedDialog(false);
  }, SUBMIT_DEBOUNCE);

  return (
    <Box align="flex-start" gap="small">
      <OkCancelDialog
        header="Plan Changed"
        onOk={onSubmit}
        show={showPlanChangedDialog}
        onCancel={() => setShowPlanChangedDialog(false)}
      >
        You have made an update to this Customer&apos;s plan. This will result
        in the meals they receive changing. Are you sure you want to do this?
      </OkCancelDialog>
      <Header
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>Update Customer</Heading>
        <Button
          primary
          disabled={!dirty}
          label="Save"
          name="submit"
          onClick={() => setShowPlanChangedDialog(true)}
        />
        {customer.plans.length > 0 &&
          (!customer.customPlan ? (
            <Button
              primary
              label="Create custom plan"
              type="submit"
              onClick={() => {
                const deliveries = convertPlanFormat(
                  customer.plans,
                  itemFamilies
                ).deliveries;
                updateCustomer({
                  ...customer,
                  customPlan: deliveries,
                });
                setDirty(true);
              }}
            />
          ) : (
            <Button
              primary
              onClick={() => {
                updateCustomer({
                  ...customer,
                  customPlan: undefined,
                });
                setDirty(true);
              }}
              label="Remove custom plan"
            />
          ))}
      </Header>
      <Box direction="column">
        <Text>
          <strong>Name:</strong> {customer.firstName} {customer.surname}
        </Text>
        <Text>
          <strong>Email:</strong> {customer.email}
        </Text>
        {customer.plans?.map((plan, index) => {
          return (
            <Text>
              <strong>Plan {index + 1}:</strong> {plan.name} -{' '}
              {plan.daysPerWeek} days per week x {plan.itemsPerDay} meals per
              day = {plan.totalMeals}
            </Text>
          );
        })}
      </Box>
      <Heading level={3}>Customisations</Heading>
      <Select
        multiple
        closeOnChange={false}
        value={customer.customisations}
        name="customisations"
        options={exclusions}
        labelKey="name"
        valueKey="name"
        onChange={(event) => {
          updateCustomer({
            ...customer,
            customisations: event.value,
          });
          setDirty(true);
        }}
      />
      {customer.customPlan && (
        <PlanPanel
          customPlan={customer.customPlan}
          plannerConfig={{
            planLabels: [...planLabels],
            extrasLabels: [...extrasLabels],
            defaultDeliveryDays,
          }}
          deliveryDays={[
            customer.deliveryDay1,
            customer.deliveryDay2,
            customer.deliveryDay3,
          ]}
          onChange={(plan) => {
            updateCustomer({
              ...customer,
              customPlan: plan,
            });
            setPlanChanged(true);
            setDirty(true);
          }}
          exclusions={exclusions}
        />
      )}
    </Box>
  );
};

export default EditCustomerPage;
