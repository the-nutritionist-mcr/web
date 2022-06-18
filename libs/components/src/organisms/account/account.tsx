import { FC } from 'react';

import { StandardPlan } from '@tnmw/types';
import { Button, Input } from '../../atoms';
import { FormSection } from '../../containers';
import styled from 'styled-components';
import { daysOfWeek } from '@tnmw/config';

export interface User {
  username: string;
  country: string;
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  customerUpdateTime: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  addressLine3: string;
  subscriptionUpdateTime: string;
  firstName: string;
  surname: string;
  email: string;
  city: string;
  postcode: string;
  plans: StandardPlan[];
}

interface AccountProps {
  userDetails: User;
  showChooseButton: boolean;
  logout: () => void;
}

export const Account: FC<AccountProps> = ({
  userDetails,
  showChooseButton,
  logout,
}) => (
  <div>
    <FormSection heading="Your Details">
      <Input label="First Name" value={userDetails.firstName} disabled />
      <Input label="Last Name" value={userDetails.surname} disabled />
    </FormSection>
    <FormSection>
      <Input label="Email" value={userDetails.email} disabled />
      <Input label="Contact Number" value={userDetails.phoneNumber} disabled />
    </FormSection>
    <FormSection>
      <Input label="Address Line 1" value={userDetails.addressLine1} disabled />
      <Input label="Address Line 2" value={userDetails.addressLine2} disabled />
      <Input label="Country" value={userDetails.country} disabled />
      <Input label="Postcode" value={userDetails.postcode} disabled />
      <Input label="City" value={userDetails.city} disabled />
    </FormSection>
    <FormSection heading="Your Plan">
      {userDetails.plans.map((plan) => (
        <>
          <Input label="Meal Size" value={plan.name} disabled />
          <Input
            label="Weekly Meals"
            value={String(plan.totalMeals)}
            disabled
          />
        </>
      ))}
    </FormSection>

    {showChooseButton && <Button primary>Choose Meals</Button>}
    <FormSection heading="Logout">
      <Button onClick={logout}>Logout</Button>
    </FormSection>
  </div>
);
