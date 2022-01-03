import { Story, Meta } from '@storybook/react';

import TabBoxComponent from './tab-box';
import Tab from './tab';

export default {
  title: 'containers/Tab Box',
  component: TabBoxComponent,
} as Meta;

const Template: Story = (args) => (
  <TabBoxComponent {...args}>
    <Tab tabTitle="Login">
      <p>Contents of one</p>
    </Tab>
    <Tab tabTitle="Register">
      <p>Contents of two</p>
    </Tab>
  </TabBoxComponent>
);

export const TabBox = Template.bind({});
