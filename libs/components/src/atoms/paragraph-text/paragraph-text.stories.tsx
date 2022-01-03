import { Story, Meta } from '@storybook/react';

import ParagraphTextComponent from './paragraph-text';

export default {
  title: 'atoms/Paragraph Text',
  component: ParagraphTextComponent,
} as Meta;

const Template: Story = (args) => <ParagraphTextComponent {...args} />;

export const Input = Template.bind({});

Input.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in orci quis libero efficitur ultrices. Vestibulum euismod, augue in dapibus vehicula, turpis magna tincidunt magna, vitae dictum nibh risus vel dolor. Maecenas at ipsum fermentum, maximus ligula vel, pharetra felis. Donec pulvinar, diam ut aliquet imperdiet, sapien lacus commodo lorem, ut tempus ex nisl nec quam. Curabitur ultricies interdum aliquet. Sed tincidunt ante in arcu vulputate aliquet. Praesent eget venenatis tellus. Maecenas risus lacus, efficitur vel placerat egestas, eleifend at justo. Phasellus facilisis ornare leo non varius. Nullam fermentum ullamcorper justo. Morbi quis quam id dolor posuere vulputate in nec elit. Praesent non nulla at risus aliquet consectetur. Pellentesque nec eros tempus, aliquet erat at, blandit odio. Nullam et nisi iaculis, tincidunt elit ac, elementum turpis.',
};
