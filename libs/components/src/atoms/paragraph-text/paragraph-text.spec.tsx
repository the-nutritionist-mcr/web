import { shallow } from 'enzyme';
import ParagraphText from './paragraph-text';

describe('The <ParagraphTest> component', () => {
  it('renders without errors', () => {
    shallow(<ParagraphText>Something</ParagraphText>);
  });

  it('renders its children', () => {
    const wrapper = shallow(<ParagraphText>Some text!</ParagraphText>);

    expect(wrapper.text()).toInclude('Some text!');
  });
});
