import { shallow } from 'enzyme';
import Heading from './heading';

describe('The <Heading> component', () => {
  it('renders without errors', () => {
    shallow(<Heading level={1}>Something</Heading>);
  });

  it('renders its children', () => {
    const wrapper = shallow(<Heading level={1}>Foo!</Heading>);
    expect(wrapper.text()).toInclude('Foo!');
  });

  it.each([
    ['h1', 1],
    ['h2', 2],
    ['h3', 3],
    ['h4', 4],
    ['h5', 5],
    ['h6', 6],
  ])('renders a %s if level is set to %d', (tag: string, level: number) => {
    const wrapper = shallow(<Heading level={level}>Foo!</Heading>);

    // disable-next-line unicorn/no-array-callback-references
    expect(wrapper.find(tag)).toHaveLength(1);
  });
});
