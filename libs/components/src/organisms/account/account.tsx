import { FC } from 'react';

import { StandardPlan } from '@tnmw/types';
import { Button, Input } from '../../atoms';
import { FormSection } from '../../containers';
import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';
import {
  sectionContents,
  chooseButtonContainer,
  header,
  text,
} from './account.css';

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
}) => {
  const { navigate } = useContext(NavigationContext);
  return (
    <div>
      <FormSection heading="Your Details" showQuestionMarkIcon>
        <Input label="First Name" value={userDetails.firstName} disabled />
        <Input label="Last Name" value={userDetails.surname} disabled />
      </FormSection>
      <FormSection showQuestionMarkIcon>
        <Input label="Email" value={userDetails.email} disabled />
        <Input
          label="Contact Number"
          value={userDetails.phoneNumber}
          disabled
        />
      </FormSection>
      <FormSection showQuestionMarkIcon>
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
        <FormSection heading="Your Plan" showQuestionMarkIcon>
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
      <FormSection heading="Choose Meals">
        {showChooseButton ? (
          <>
            <p className={text}>
              Meal selections are now open. Click on the button below to view
              the meals you will be receiving for the week or to make
              alternative choices.
            </p>
            <Button onClick={() => navigate?.('/choose-meals/')} primary>
              Make Choices
            </Button>
          </>
        ) : (
          <>
            <p className={text}>
              Meal selections for this week's cook have now closed. Check back
              here on Tuesday for next week's meal choices.
            </p>

            <Button primary disabled>
              Make Choices
            </Button>
          </>
        )}
      </FormSection>

      <FormSection heading="Logout">
        <Button backgroundColor="#E3E3E3" onClick={logout} primary>
          Logout
        </Button>
      </FormSection>
    </div>
  );
};
