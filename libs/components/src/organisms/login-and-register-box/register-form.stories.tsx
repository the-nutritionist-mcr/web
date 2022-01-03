import { Story, Meta } from '@storybook/react';

import RegisterFormComponent, { RegisterFormProps } from './register-form';

export default {
  title: 'organisms/Login and Register Box/parts/Register Form',
  component: RegisterFormComponent,
} as Meta;

const Template: Story<RegisterFormProps> = (args) => (
  <RegisterFormComponent {...args} />
);

export const RegisterForm = Template.bind({});
