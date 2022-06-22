import { Story, Meta } from '@storybook/react';

import HeaderComponent from './header';

export default {
  title: 'organisms/Header',
  component: HeaderComponent,
} as Meta;

type PropType<X> = X extends (props: infer P) => unknown ? P : never;

const Template: Story<PropType<typeof HeaderComponent>> = (args) => (
  <HeaderComponent {...args} />
);

export const Header = Template.bind({});
