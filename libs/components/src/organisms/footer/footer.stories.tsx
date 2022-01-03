import { Story, Meta } from '@storybook/react';

import FooterComponent from './footer';

export default {
  title: 'organisms/Footer',
  component: FooterComponent,
} as Meta;

const Template: Story = (args) => <FooterComponent {...args} />;

export const Footer = Template.bind({});
