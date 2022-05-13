import { Form, Header, Heading, Button, Paragraph } from 'grommet';
import React, { FC } from 'react';
import { planLabels, extrasLabels, defaultDeliveryDays } from '@tnmw/config';
import { convertPlanFormat } from '@tnmw/utils';
import { debounce } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog } from '../../components';
import EditCustomerDetailsPanel from './EditCustomerDetailsPanel';
import {
  BackendCustomer,
  CustomerWithChargebeePlan,
  Delivery,
  Exclusion,
} from '@tnmw/types';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: BackendCustomer;
  customisations: Exclusion[];
}

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer,
}) => {
  const [dirty, setDirty] = React.useState(false);
  const [customPlan, setCustomPlan] = React.useState<undefined | Delivery[]>(
    customer.customPlan
  );
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

        <Paragraph fill>
          <em>
            Please note that most customer personal details are{' '}
            <strong>read only</strong> from this page. If you wish to make
            changes, you will need to do so within ChargeBee
          </em>
        </Paragraph>
        <Heading level={3}>Personal Details</Heading>
        <EditCustomerDetailsPanel exclusions={exclusions} />
        {customPlan ? (
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
        ) : (
          <Button
            primary
            onClick={() => {
              const deliveries = convertPlanFormat(customer.plans).deliveries;
              setCustomPlan(deliveries);
            }}
          >
            Create Custom Plan
          </Button>
        )}
      </Form>
    </>
  );
};

export default EditCustomerPage;
