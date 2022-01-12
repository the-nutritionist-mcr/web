import { Form, Header, Heading, Button } from "grommet";
import React, { FC } from "react";
import { ThunkDispatch } from "redux-thunk";
import { Prompt, RouteComponentProps, useHistory } from "react-router-dom";
import {
  daysPerWeekOptions,
  plans,
  planLabels,
  extrasLabels,
  defaultDeliveryDays,
} from "../../lib/config";
import Customer, { Snack } from "../../domain/Customer";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import PlanPanel from "./PlanPanel";
import { makeNewPlan } from "./distribution-generator";
import { createCustomer } from "./customersSlice";

import { allExclusionsSelector } from "../exclusions/exclusionsSlice";
import AppState from "../../types/AppState";
import { AnyAction } from "redux";
import EditCustomerDetailsPanel from "./EditCustomerDetailsPanel";

const SUBMIT_DEBOUNCE = 500;

const defaultCustomer = {
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
  newPlan: makeNewPlan({
    planLabels: [...planLabels],
    extrasLabels: [...extrasLabels],
    defaultDeliveryDays,
  }),
  snack: Snack.None,
  breakfast: false,
  exclusions: [],
};

interface PathParams {
  id?: string;
}

const NewCustomerPage: FC<RouteComponentProps<PathParams>> = () => {
  const exclusions = useSelector(allExclusionsSelector);

  const [customer, setCustomer] = React.useState<Customer>(defaultCustomer);
  const [dirty, setDirty] = React.useState(false);

  const dispatch = useDispatch<ThunkDispatch<AppState, Customer, AnyAction>>();
  const history = useHistory();

  const onSubmit = debounce(async () => {
    const submittingCustomer = {
      ...customer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      breakfast: (customer.breakfast as any) === "Yes",
    };

    await dispatch(createCustomer(submittingCustomer));
    setDirty(false);
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
      <Form value={customer} onChange={onChange} onSubmit={onSubmit}>
        <Prompt
          when={dirty}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
        <Header justify="start" gap="small">
          <Heading level={2}>New Customer</Heading>

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
          }}
          exclusions={exclusions}
        />
      </Form>
    </>
  );
};

export default NewCustomerPage;
