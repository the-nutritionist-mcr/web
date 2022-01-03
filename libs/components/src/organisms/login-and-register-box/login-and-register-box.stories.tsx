import { Story, Meta } from '@storybook/react';

import LoginAndRegisterBoxComponent from './login-and-register-box';

export default {
  title: 'organisms/Login and Register Box',
  component: LoginAndRegisterBoxComponent,
  argTypes: { onLogin: { action: 'clicked', errors: { control: 'array' } } },
} as Meta;

const Template: Story = (args) => (
  <LoginAndRegisterBoxComponent defaultTab="Login" {...args} />
);

export const Main = Template.bind({});
Main.args = {
  errors: [],
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  errors: [{ message: 'Incorrect Password' }],
};
