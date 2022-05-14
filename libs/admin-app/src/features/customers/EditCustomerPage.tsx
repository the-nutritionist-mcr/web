import { Form, Header, Heading, Button, Paragraph, Select, Box } from 'grommet';
import React, { FC } from 'react';
import { FormField } from 'grommet';
import { planLabels, extrasLabels, defaultDeliveryDays } from '@tnmw/config';
import { convertPlanFormat } from '@tnmw/utils';
import { debounce } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog } from '../../components';
import EditCustomerDetailsPanel from './EditCustomerDetailsPanel';
import {
  BackendCustomer,
  Delivery,
  Exclusion,
  UpdateCustomerBody,
} from '@tnmw/types';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: BackendCustomer;
  customisations: Exclusion[];
  updateCustomer: (details: UpdateCustomerBody) => void;
}

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer,
  updateCustomer,
}) => {
  const [dirty, setDirty] = React.useState(false);
  const [customPlan, setCustomPlan] = React.useState<undefined | Delivery[]>(
    customer.customPlan
  );
  const [customisations, setCustomisations] = React.useState<Exclusion[]>(
    customer.customisations ?? []
  );
  const [planChanged, setPlanChanged] = React.useState(false);
  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const onSubmit = debounce(async () => {
    const submittingCustomer = {
      ...customer,
    };

    updateCustomer({
      customisations: customisations,
      customPlan: customPlan,
    });

    setDirty(false);
    setPlanChanged(false);
    setShowPlanChangedDialog(false);
  }, SUBMIT_DEBOUNCE);

  return (
    <Box align="flex-start">
      <OkCancelDialog
        header="Plan Changed"
        onOk={onSubmit}
        show={showPlanChangedDialog}
        onCancel={() => setShowPlanChangedDialog(false)}
      >
        You have made an update to this Customer&apos;s plan. This will result
        in the meals they receive changing. Are you sure you want to do this?
      </OkCancelDialog>
      <Header justify="start" gap="small">
        <Heading level={2}>Update Customer</Heading>
        <Button
          primary
          disabled={!dirty}
          label="Save"
          name="submit"
          onClick={() => setShowPlanChangedDialog(true)}
        />
        {!customPlan ? (
          <Button
            primary
            label="Create custom plan"
            type="submit"
            onClick={() => {
              const deliveries = convertPlanFormat(customer.plans).deliveries;
              setCustomPlan(deliveries);
              setDirty(true);
            }}
          />
        ) : (
          <Button
            primary
            onClick={() => {
              setCustomPlan(undefined);
              setDirty(true);
            }}
            label="Remove custom plan"
          />
        )}
      </Header>
      <Heading level={3}>Customisations</Heading>
      <Select
        multiple
        closeOnChange={false}
        name="customisations"
        options={exclusions}
        labelKey="name"
        valueKey="name"
        onChange={(event) => {
          setCustomisations(event.value);
          setDirty(true);
        }}
      />
      {customPlan && (
        <PlanPanel
          customPlan={customPlan}
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
