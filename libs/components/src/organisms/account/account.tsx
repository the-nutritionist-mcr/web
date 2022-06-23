import { FC } from 'react';

import { StandardPlan } from '@tnmw/types';
import { Button, Input } from '../../atoms';
import { FormSection } from '../../containers';
import styled from 'styled-components';
import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';

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

const Header = styled.h2`
  font-family: 'Acumin Pro', Arial, sans-serif;
`;

const SectionContents = styled.div`
  border-top 1px dashed #B8B8B8;
  width: 100%;
  display: flex;
  padding-top: 1.2rem;
`;
const ChooseButtonContainer = styled.div`
  margin-bottom: 3.2rem;
`;

export const Account: FC<AccountProps> = ({
  userDetails,
  showChooseButton,
  logout,
}) => {
  const { navigate } = useContext(NavigationContext);
  return (
    <div>
      <FormSection heading="Your Details">
        <Input label="First Name" value={userDetails.firstName} disabled />
        <Input label="Last Name" value={userDetails.surname} disabled />
      </FormSection>
      <FormSection>
        <Input label="Email" value={userDetails.email} disabled />
        <Input
          label="Contact Number"
          value={userDetails.phoneNumber}
          disabled
        />
      </FormSection>
      <FormSection>
        <Input
          label="Address Line 1"
          value={userDetails.addressLine1}
          disabled
        />
        <Input
          label="Address Line 2"
          value={userDetails.addressLine2}
          disabled
        />
        <Input label="Country" value={userDetails.country} disabled />
        <Input label="Postcode" value={userDetails.postcode} disabled />
        <Input label="City" value={userDetails.city} disabled />
      </FormSection>
      {userDetails.plans.length > 0 && (
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
      )}
      <ChooseButtonContainer>
        {showChooseButton && (
          <Button onClick={() => navigate?.('/choose-meals/')} primary>
            Choose Meals
          </Button>
        )}
      </ChooseButtonContainer>

      <div>
        <Header>Logout</Header>
        <SectionContents>
          <Button backgroundColor="#E3E3E3" onClick={logout} primary>
            Logout
          </Button>
        </SectionContents>
      </div>
    </div>
  );
};
