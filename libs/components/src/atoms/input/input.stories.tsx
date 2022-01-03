import { Story, Meta } from '@storybook/react';

import InputComponent, { InputProps } from './input';

export default {
  title: 'atoms/Input',
  component: InputComponent,
} as Meta;

const Template: Story<InputProps> = (args) => <InputComponent {...args} />;

export const Input = Template.bind({});

Input.args = {
  label: 'Some Field',
  value: '',
  error: false,
  placeholder: 'Enter something',
};
