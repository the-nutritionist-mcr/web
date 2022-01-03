import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import QuantityStepper, { QuantityStepperProps } from './quantity-stepper';

export default {
  title: 'molecules/Quantity Stepper',
  component: QuantityStepper,
} as Meta;

const Template: Story<QuantityStepperProps> = (args) => {
  const [value, setValue] = useState(0);

  return (
    <QuantityStepper
      onChange={(newValue) => setValue(newValue)}
      value={value}
      {...args}
    />
  );
};

export const Stepper = Template.bind({});

Stepper.args = {
  min: 0,
  max: 4,
  label: '',
};

export const LabelledStepper = Template.bind({});
LabelledStepper.args = {
  min: 0,
  max: 4,
  label: 'A stepper with some text',
};
