import { Story, Meta } from '@storybook/react';

import ChallengeFormComponent, { ChallengeFormProps } from './challenge-form';

export default {
  title: 'containers/Challenge Form',
  component: ChallengeFormComponent,
  argTypes: {
    errors: {
      control: 'array',
      table: {
        category: 'props',
      },
    },
  },
} as Meta;

const Template: Story<ChallengeFormProps<Record<string, unknown>>> = (args) => (
  <ChallengeFormComponent {...args}>
    <p>Some content</p>
  </ChallengeFormComponent>
);

export const Main = Template.bind({});

Main.args = {};

export const WithErrors = Template.bind({});
WithErrors.args = {
  errors: [{ message: 'An error!' }],
};
