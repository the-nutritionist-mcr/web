import { Meta, Story } from '@storybook/react';
import { useState } from 'react';

import MealCounterComponent, { MealCounterProps } from './meal-counter';

export default {
  title: 'organisms/Meal Selections/parts/Meal Counter',
  component: MealCounterComponent,
} as Meta;

const Template: Story<MealCounterProps> = (args) => {
  const [value, setValue] = useState(0);
  return (
    <MealCounterComponent
      onChange={(newValue) => setValue(newValue)}
      value={value}
      {...args}
    />
  );
};

export const MealCounter = Template.bind({});

MealCounter.args = {
  title: 'French toast, fruit & yoghurt',
  description:
    'French toast, fresh seasonal fruit, greek yoghurt and mint garnish',
  min: 0,
  max: 4,
};
