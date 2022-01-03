import { shallow } from 'enzyme';
import Box from './box';

describe('The <Box> component', () => {
  it('renders without errors', () => {
    shallow(<Box />);
  });

  it('renders its children', () => {
    const wrapper = shallow(<Box>Foo</Box>);
    expect(wrapper.text()).toInclude('Foo');
  });
});
