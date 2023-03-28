import { Story } from '@storybook/react';

import ButtonComponent, { ButtonProps } from './button';

export default {
  title: 'atoms/Button',
  component: ButtonComponent,
  argTypes: {
    primary: { name: 'Primary', type: 'boolean', defaultValue: false },
    color: { name: 'Color', type: 'string', defaultValue: undefined },
  },
};

const Template: Story<ButtonProps> = (args) => (
  <ButtonComponent {...args}>Click Me</ButtonComponent>
);

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  primary: false,
};
