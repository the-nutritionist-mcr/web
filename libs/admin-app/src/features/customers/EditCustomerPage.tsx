import { Form, Header, Heading, Button, Paragraph } from 'grommet';
import React, { FC } from 'react';
import { planLabels, extrasLabels, defaultDeliveryDays } from '@tnmw/config';
import { debounce } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog } from '../../components';
import EditCustomerDetailsPanel from './EditCustomerDetailsPanel';
import { CustomerWithChargebeePlan, Exclusion } from '@tnmw/types';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: CustomerWithChargebeePlan;
  customisations: Exclusion[];
}

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer,
}) => {
  const [dirty, setDirty] = React.useState(false);
  const [planChanged, setPlanChanged] = React.useState(false);
  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const onSubmit = debounce(async () => {
    const submittingCustomer = {
      ...customer,
    };

    setDirty(false);
    setPlanChanged(false);
    setShowPlanChangedDialog(false);
  }, SUBMIT_DEBOUNCE);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (nextCustomerData: any): void => {
    setDirty(true);
    const nextCustomer = {
      ...nextCustomerData,
      startDate:
        nextCustomerData.startDate === 'string' && nextCustomerData.startDate
          ? new Date(nextCustomerData.startDate)
          : nextCustomerData.startDate,
      paymentDayOfMonth:
        nextCustomerData.paymentDayOfMonth === ''
          ? undefined
          : nextCustomerData.paymentDayOfMonth,
    };
  };
  return (
    <>
      <Form
        value={customer}
        onChange={onChange}
        onSubmit={planChanged ? () => setShowPlanChangedDialog(true) : onSubmit}
      >
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
            type="submit"
            name="submit"
          />
        </Header>

        <Heading level={3}>Personal Details</Heading>
        <EditCustomerDetailsPanel />
        <PlanPanel
          plan={customer.newPlan}
          plannerConfig={{
            planLabels: [...planLabels],
            extrasLabels: [...extrasLabels],
            defaultDeliveryDays,
          }}
          onChange={(plan) => {
            onChange({ ...customer, newPlan: plan });
            setPlanChanged(true);
          }}
          exclusions={exclusions}
        />
      </Form>
    </>
  );
};

export default EditCustomerPage;
