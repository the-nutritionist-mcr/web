import { Story, Meta } from '@storybook/react';

import HeaderComponent from './header';

export default {
  title: 'organisms/Header',
  component: HeaderComponent,
} as Meta;

const Template: Story = (args) => <HeaderComponent {...args} />;

export const Header = Template.bind({});
