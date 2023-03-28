import { FC, useEffect } from 'react';

import { StandardPlan } from '@tnmw/types';
import { Button, Input, Link } from '../../atoms';
import { FormSection } from '../../containers';
import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';
import { text } from './account.css';

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
  plans?: StandardPlan[];
}

interface AccountProps {
  userDetails: User;
  chooseIsOpen: boolean;
  logout: () => void;
}

export const Account: FC<AccountProps> = ({
  userDetails,
  chooseIsOpen,
  logout,
}) => {
  const plans = userDetails?.plans
    ?.filter((plan) => plan.totalMeals > 0)
    ?.filter((plan) => plan.subscriptionStatus === 'active');

  const { prefetch } = useContext(NavigationContext);

  useEffect(() => {
    prefetch?.('/choose-meals/');
  }, [prefetch]);

  return (
    <div>
      <FormSection heading="Your Details" showQuestionMarkIcon>
        <Input
          name="firstName"
          label="First Name"
          value={userDetails.firstName}
          disabled
        />
        <Input
          name="surname"
          label="Last Name"
          value={userDetails.surname}
          disabled
        />
      </FormSection>
      <FormSection showQuestionMarkIcon>
        <Input name="email" label="Email" value={userDetails.email} disabled />
        <Input
          label="Contact Number"
          name="phoneNumber"
          value={userDetails.phoneNumber}
          disabled
        />
      </FormSection>
      <FormSection showQuestionMarkIcon>
        <Input
          name="addressLine1"
          label="Address Line 1"
          value={userDetails.addressLine1}
          disabled
        />
        <Input
          name="addressLine2"
          label="Address Line 2"
          value={userDetails.addressLine2}
          disabled
        />
        <Input
          name="country"
          label="Country"
          value={userDetails.country}
          disabled
        />
        <Input
          name="postcode"
          label="Postcode"
          value={userDetails.postcode}
          disabled
        />
        <Input name="city" label="City" value={userDetails.city} disabled />
      </FormSection>
      {(plans?.length ?? 0) > 0 && (
        <FormSection heading="Your Plan" showQuestionMarkIcon>
          {plans?.map((plan) => (
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
      {(plans?.filter((plan) => !plan.isExtra).length ?? 0) > 0 && (
        <FormSection heading="Choose Meals">
          {chooseIsOpen ? (
            <>
              <p className={text}>
                Meal selections are now open. Click on the button below to view
                the meals you will be receiving for the week or to make
                alternative choices.
              </p>
              <Link path="/choose-meals/">
                <Button primary>Make Choices</Button>
              </Link>
            </>
          ) : (
            <>
              <p className={text}>
                Meal selections for this week's cook have now closed. Check back
                here from 6am on Tuesday for next week's meal choices.
              </p>

              <Button primary disabled>
                Make Choices
              </Button>
            </>
          )}
        </FormSection>
      )}

      <FormSection heading="Logout">
        <Button backgroundColor="#E3E3E3" onClick={logout} primary>
          Logout
        </Button>
      </FormSection>
    </div>
  );
};
