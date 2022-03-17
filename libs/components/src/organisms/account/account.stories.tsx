import { Story, Meta } from '@storybook/react';
import { FC } from 'hoist-non-react-statics/node_modules/@types/react';

import { Account as AccountComponent } from './account';
import { StandardPlan } from '@tnmw/types';

type PropsOfFC<T> = T extends FC<infer P> ? P : never;

export default {
  title: 'organisms/Account',
  component: AccountComponent,
} as Meta;

const plans: StandardPlan[] = [
  {
    name: 'EQ',
    daysPerWeek: 1,
    itemsPerDay: 2,
    isExtra: true,
    totalMeals: 2,
  },
];

const initialDetails = {
  username: 'ben',
  customerUpdateTime: '123',
  subscriptionUpdateTime: '123',
  deliveryDay1: 'Monday',
  deliveryDay2: 'Wednesday',
  deliveryDay3: 'Friday',
  firstName: 'Ben',
  surname: 'Wainwright',
  phoneNumber: '0123',
  lastName: 'Wainwright',
  email: 'ben@thenutritionistmcr.com',
  contactNumber: '0123456789',
  addressLine1: 'Flat 2',
  addressLine2: 'Rectangle house',
  addressLine3: 'Salford',
  city: 'Manchester',
  country: 'United Kingdom',
  postcode: 'M1 5LT',
  plans,
};

const Template: Story<PropsOfFC<typeof AccountComponent>> = (args) => (
  <AccountComponent {...args} userDetails={initialDetails} />
);

export const Account = Template.bind({});
