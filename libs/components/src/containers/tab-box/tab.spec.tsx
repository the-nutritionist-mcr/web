import { shallow } from 'enzyme';
import Tab from './tab';

describe('The <Tab > component', () => {
  it('renders without errors', () => {
    shallow(<Tab tabTitle="Foo">Something</Tab>);
  });

  it('renders its children', () => {
    const wrapper = shallow(<Tab tabTitle="Foo">Child</Tab>);
    expect(wrapper.text()).toInclude('Child');
  });
});
