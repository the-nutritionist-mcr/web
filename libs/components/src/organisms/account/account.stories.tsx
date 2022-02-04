import { Story, Meta } from '@storybook/react';
import { FC } from 'hoist-non-react-statics/node_modules/@types/react';

import { Account as AccountComponent } from './account';

type PropsOfFC<T> = T extends FC<infer P> ? P : never;

export default {
  title: 'organisms/Account',
  component: AccountComponent
} as Meta;

const initialDetails = {
  firstName: 'Ben',
  lastName: 'Wainwright',
  email: 'ben@thenutritionistmcr.com',
  contactNumber: '0123456789',
  addressLine1: 'Flat 2',
  addressLine2: 'Rectangle house',
  addressLine3: 'Salford',
  city: 'Manchester',
  country: 'United Kingdom',
  postcode: 'M1 5LT'
};

const Template: Story<PropsOfFC<typeof AccountComponent>> = args => (
  <AccountComponent {...args} userDetails={initialDetails} />
);

export const Account = Template.bind({});
