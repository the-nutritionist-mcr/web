import { Form, Header, Heading, Button, Paragraph } from "grommet";
import React, { FC } from "react";
import { ThunkDispatch } from "redux-thunk";
import { Prompt, RouteComponentProps, useHistory } from "react-router-dom";
import {
  planLabels,
  extrasLabels,
  defaultDeliveryDays,
} from "../../lib/config";
import Customer from "../../domain/Customer";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import PlanPanel from "./PlanPanel";
import { updateCustomer, customerByIdSelector } from "./customersSlice";

import { allExclusionsSelector } from "../exclusions/exclusionsSlice";
import AppState from "../../types/AppState";
import { AnyAction } from "redux";
import { OkCancelDialog } from "../../components";
import EditCustomerDetailsPanel from "./EditCustomerDetailsPanel";
import { NotFound } from "../../components/not-found";

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  id?: string;
}

const EditCustomerPage: FC<RouteComponentProps<EditCustomerPathParams>> = (
  props
) => {
  const exclusions = useSelector(allExclusionsSelector);
  const idCustomer = useSelector(
    customerByIdSelector(props.match.params.id ?? "")
  );

  const [customer, setCustomer] = React.useState<Customer | undefined>(
    idCustomer
  );
  const [dirty, setDirty] = React.useState(false);
  const [planChanged, setPlanChanged] = React.useState(false);
  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const dispatch = useDispatch<ThunkDispatch<AppState, Customer, AnyAction>>();
  const history = useHistory();

  if (!customer) {
    return <NotFound />;
  }

  const onSubmit = debounce(async () => {
    const submittingCustomer = {
      ...customer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      breakfast: (customer.breakfast as any) === "Yes",
    };

    await dispatch(updateCustomer(submittingCustomer));
    setDirty(false);
    setPlanChanged(false);
    setShowPlanChangedDialog(false);
    history.push("/customers");
  }, SUBMIT_DEBOUNCE);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (nextCustomerData: any): void => {
    setDirty(true);
    const nextCustomer = {
      ...nextCustomerData,
      startDate:
        nextCustomerData.startDate === "string" && nextCustomerData.startDate
          ? new Date(nextCustomerData.startDate)
          : nextCustomerData.startDate,
      paymentDayOfMonth:
        nextCustomerData.paymentDayOfMonth === ""
          ? undefined
          : nextCustomerData.paymentDayOfMonth,
    };

    setCustomer(nextCustomer);
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
        <Prompt
          when={dirty}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
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
        {!customer.newPlan && (
          <>
            <Heading level={3}>Legacy Plan</Heading>
            <Paragraph fill>
              {customer.plan.category} {customer.plan.mealsPerDay} (
              {customer.daysPerWeek} days)
            </Paragraph>
          </>
        )}
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
