
import { Story, Meta } from '@storybook/react';
import { FC } from 'hoist-non-react-statics/node_modules/@types/react';

import { Account as AccountComponent } from './account';

type PropsOfFC<T> = T extends FC<infer P> ? P : never

export default {
  title: 'organisms/Account',
  component: AccountComponent,
} as Meta;

const Template: Story<PropsOfFC<typeof AccountComponent>> = (args) => <AccountComponent {...args} />;

export const Account = Template.bind({});
