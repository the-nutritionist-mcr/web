import {
  Header,
  Heading,
  Button,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  CardBody,
  Tag,
} from 'grommet';
import React, { FC } from 'react';
import moment from 'moment';
import { ResetPasswordDialog } from './reset-password-dialog';
import {
  planLabels,
  extrasLabels,
  defaultDeliveryDays,
  itemFamilies,
} from '@tnmw/config';
import { debounce } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog, TagInput } from '../../components';
import {
  BackendCustomer,
  Exclusion,
  SubscriptionStatus,
  UpdateCustomerBody,
} from '@tnmw/types';
import {
  planGrid,
  planTagActive,
  planTagCancelled,
  planTagFuture,
  planTagPaused,
} from './edit-customer-page.css';
import { convertPlanFormat, validateCustomPlan } from '@tnmw/meal-planning';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: BackendCustomer;
  customisations: Exclusion[];
  dirty: boolean;
  saveCustomer: (details: UpdateCustomerBody) => void;
  chargebeeUrl: string;
  resetPassword: (payload: {
    username: string;
    newPassword: string;
    forceChange: boolean;
  }) => Promise<void>;
}

const calendarFormat = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: '[this] dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'MMM Do',
};

const makePauseString = (start?: number, end?: number) => {
  const startWord = start && moment(start).calendar(null, calendarFormat);
  const endWord = end && moment(end).calendar(null, calendarFormat);
  if (!startWord && !endWord) {
    return 'No pause';
  }

  if (!startWord) {
    return `Until ${endWord}`;
  }

  if (!endWord) {
    return `Indefinite pause from ${startWord}`;
  }

  return `From ${startWord} to ${endWord}`;
};

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer: apiCustomer,
  saveCustomer,
  chargebeeUrl,
  resetPassword,
}) => {
  const [dirty, setDirty] = React.useState(false);

  type StatusClasses = { [K in SubscriptionStatus]: string };

  const statusClasses: StatusClasses = {
    active: planTagActive,
    future: planTagFuture,
    in_trial: '',
    non_renewing: planTagActive,
    paused: planTagPaused,
    cancelled: planTagCancelled,
  };

  const [customer, setCustomer] = React.useState(apiCustomer);

  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const [showResetPasswordDialog, setShowResetPasswordDialog] =
    React.useState(false);
  const defaultPlanDeliveries = convertPlanFormat(
    customer.plans,
    itemFamilies
  ).deliveries;

  const onSubmit = debounce(async () => {
    saveCustomer({
      customisations: customer.customisations,
      customPlan: customer.customPlan ? customer.customPlan : undefined,
    });

    setDirty(false);
    setShowPlanChangedDialog(false);
  }, SUBMIT_DEBOUNCE);

  const validChange = validateCustomPlan(customer);

  return (
    <>
      <OkCancelDialog
        header="Plan Changed"
        onOk={onSubmit}
        show={showPlanChangedDialog}
        onCancel={() => setShowPlanChangedDialog(false)}
      >
        You have made an update to this Customer&apos;s plan. This will result
        in the meals they receive changing. Are you sure you want to do this?
      </OkCancelDialog>
      {showResetPasswordDialog && (
        <ResetPasswordDialog
          onCancel={() => setShowResetPasswordDialog(false)}
          onSubmit={async (password, forceChange) => {
            await resetPassword({
              username: customer.username,
              newPassword: password,
              forceChange,
            });
            setShowResetPasswordDialog(false);
          }}
        />
      )}
      <Header
        justify="start"
        gap="small"
        style={{ marginTop: '2rem', marginBottom: '2rem' }}
      >
        <Heading level={2}>Update Customer</Heading>
        <Button
          primary
          label="Reset Password"
          onClick={() => setShowResetPasswordDialog(true)}
        />
        <Button
          primary
          disabled={!dirty || !validChange}
          label="Save"
          name="submit"
          onClick={() => setShowPlanChangedDialog(true)}
        />
      </Header>
      <Box align="flex-start" gap="large">
        <Table style={{ maxWidth: '40rem', tableLayout: 'fixed' }}>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                {customer.firstName} {customer.surname}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Email</strong>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Delivery Day 1</strong>
              </TableCell>
              <TableCell>{customer.deliveryDay1 || 'Not Set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Delivery Day 2</strong>
              </TableCell>
              <TableCell>{customer.deliveryDay2 || 'Not Set'}</TableCell>
            </TableRow>
            {/*
            <TableRow>
              <TableCell scope="row">
                <strong>Chargebee</strong>
              </TableCell>
              <TableCell>
                <a href={`${chargebeeUrl}/d/customers/${customer.username}`}>
                  Go to profile
                </a>
              </TableCell>
            </TableRow>
            */}
          </TableBody>
        </Table>
        <Box>
          <Heading level={3}>Customisations</Heading>
          <TagInput
            options={exclusions.map((exclusion) => ({
              key: exclusion.id,
              label: exclusion.name,
            }))}
            onChange={(values) => {
              setCustomer({
                ...customer,
                customisations: values
                  .map((value) =>
                    exclusions.find((exclusion) => exclusion.id === value.key)
                  )
                  .flatMap((value) => (value ? [value] : [])),
              });
              setDirty(true);
            }}
            values={customer.customisations.map((exclusion) => ({
              key: exclusion.id,
              label: exclusion.name,
            }))}
          />
        </Box>
        <PlanPanel
          onClear={() => {
            setCustomer({
              ...customer,
              customPlan: undefined,
            });
            setDirty(true);
          }}
          customPlan={customer.customPlan}
          defaultPlan={defaultPlanDeliveries}
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
            setCustomer({
              ...customer,
              customPlan: plan,
            });
            setDirty(true);
          }}
          exclusions={exclusions}
        />

        <Box width="100%">
          <Heading level={3}>Plans</Heading>
          <div className={planGrid}>
            {customer.plans?.map((plan) => {
              return (
                <Card pad="medium">
                  <CardHeader>
                    <Heading level={3}>{plan.name}</Heading>
                    <span className={statusClasses[plan.subscriptionStatus]}>
                      <Tag value={plan.subscriptionStatus} />
                    </span>
                  </CardHeader>
                  <CardBody pad="small">
                    <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableBody>
                        <TableRow>
                          <TableCell scope="row">
                            <strong>Days</strong>
                          </TableCell>
                          <TableCell>{plan.daysPerWeek}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            <strong>Total meals</strong>
                          </TableCell>
                          <TableCell>{plan.totalMeals}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            <strong>Meals per day</strong>
                          </TableCell>
                          <TableCell>{plan.itemsPerDay}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <em>
                              {makePauseString(plan.pauseStart, plan.pauseEnd)}
                            </em>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default EditCustomerPage;
