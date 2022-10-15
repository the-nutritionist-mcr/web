import {
  Form,
  Header,
  Heading,
  Button,
  Paragraph,
  Select,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from 'grommet';
import React, { FC } from 'react';
import moment from 'moment';
import { ResetPasswordDialog } from './reset-password-dialog';
import {
  planLabels,
  extrasLabels,
  defaultDeliveryDays,
  itemFamilies,
  calendarFormat,
} from '@tnmw/config';
import { convertPlanFormat } from '@tnmw/utils';
import { debounce } from 'lodash';
import PlanPanel from './PlanPanel';

import { OkCancelDialog, TagInput } from '../../components';
import { BackendCustomer, Exclusion, UpdateCustomerBody } from '@tnmw/types';

const SUBMIT_DEBOUNCE = 500;

export interface EditCustomerPathParams {
  customer: BackendCustomer;
  customisations: Exclusion[];
  dirty: boolean;
  updateCustomer: (details: UpdateCustomerBody) => void;
  saveCustomer: (details: UpdateCustomerBody) => void;
  resetPassword: (payload: {
    username: string;
    newPassword: string;
  }) => Promise<void>;
}

const EditCustomerPage: FC<EditCustomerPathParams> = ({
  customisations: exclusions,
  customer,
  updateCustomer,
  saveCustomer,
  resetPassword,
}) => {
  const [dirty, setDirty] = React.useState(false);

  const [showPlanChangedDialog, setShowPlanChangedDialog] =
    React.useState(false);

  const [showResetPasswordDialog, setShowResetPasswordDialog] =
    React.useState(false);

  const onSubmit = debounce(async () => {
    saveCustomer({
      customisations: customer.customisations,
      customPlan: customer.customPlan ? customer.customPlan : undefined,
    });

    setDirty(false);
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
      {showResetPasswordDialog && (
        <ResetPasswordDialog
          onCancel={() => setShowResetPasswordDialog(false)}
          onSubmit={async (password) => {
            await resetPassword({
              username: customer.username,
              newPassword: password,
            });
            setShowResetPasswordDialog(false);
          }}
        />
      )}
      <Header
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>Update Customer</Heading>
        <Button
          primary
          label="Reset Password"
          onClick={() => setShowResetPasswordDialog(true)}
        />
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
        <Table style={{ maxWidth: '40rem', marginBottom: '2rem' }}>
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
          </TableBody>
        </Table>
        <Table style={{ maxWidth: '40rem', marginBottom: '2rem' }}>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
                <strong>Plan</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Days per Week</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Meals per Day</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Total meals</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Status</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Pause Start</strong>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <strong>Pause End</strong>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customer.plans?.map((plan) => {
              return (
                <TableRow key={`customer-page-plan-${plan.id}`}>
                  <TableCell scope="row">
                    <strong>{plan.name}</strong>
                  </TableCell>
                  <TableCell scope="row">{plan.daysPerWeek}</TableCell>
                  <TableCell scope="row">{plan.itemsPerDay}</TableCell>
                  <TableCell scope="row">{plan.totalMeals}</TableCell>
                  <TableCell scope="row">{plan.subscriptionStatus}</TableCell>
                  <TableCell scope="row">
                    {plan.pauseStart
                      ? moment(plan.pauseStart).calendar(null, calendarFormat)
                      : 'None'}
                  </TableCell>
                  <TableCell scope="row">
                    {plan.pauseEnd
                      ? moment(plan.pauseEnd).calendar(null, calendarFormat)
                      : 'None'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Heading level={3}>Customisations</Heading>
      <TagInput
        options={exclusions.map((exclusion) => ({
          key: exclusion.id,
          label: exclusion.name,
        }))}
        onChange={(values) => {
          updateCustomer({
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
            setDirty(true);
          }}
          exclusions={exclusions}
        />
      )}
    </Box>
  );
};

export default EditCustomerPage;
