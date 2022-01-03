import { Story, Meta } from '@storybook/react';
import MenuIcon from './menu.svg';

import IconButtonComponent, { IconButtonProps } from './icon-button';

export default {
  title: 'atoms/Icon Button',
  component: IconButtonComponent,
} as Meta;

const Template: Story<IconButtonProps> = () => {
  return <IconButtonComponent a11yLabel="Menu Button" icon={MenuIcon} />;
};

export const IconButton = Template.bind({});
