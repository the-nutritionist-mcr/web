import { shallow } from 'enzyme';
import TabButton from './tab-button';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';

describe('The <TabButton> component', () => {
  it('renders without error', () => {
    shallow(<TabButton tabListLength={1}>Something</TabButton>);
  });

  it('has a bottom border when inactive', () => {
    const button = renderer
      .create(<TabButton tabListLength={1}>Something</TabButton>)
      .toJSON();
    expect(button).toHaveStyleRule('border-bottom', `1px solid black`);
  });

  it('has no border when active', () => {
    const button = renderer
      .create(
        <TabButton tabListLength={1} active>
          Something
        </TabButton>
      )
      .toJSON();
    expect(button).toHaveStyleRule('border-bottom', `0`);
  });

  it('has grey background when inactive', () => {
    const button = renderer
      .create(<TabButton tabListLength={1}>Something</TabButton>)
      .toJSON();
    expect(button).toHaveStyleRule('background', `#E3E3E3`);
  });

  it('has white background when active', () => {
    const button = renderer
      .create(
        <TabButton tabListLength={1} active>
          Something
        </TabButton>
      )
      .toJSON();
    expect(button).toHaveStyleRule('background', `white`);
  });

  it('renders its children', () => {
    const wrapper = shallow(<TabButton tabListLength={1}>Some Text</TabButton>);
    expect(wrapper.text()).toInclude('Some Text');
  });

  it('passes the onClick prop', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <TabButton tabListLength={1} onClick={onClick}>
        Some Text
      </TabButton>
    );

    act(() => {
      wrapper.find('button').simulate('click');
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('passes the active prop to aria-selected', () => {
    const wrapper = shallow(
      <TabButton tabListLength={1} active>
        Some Text
      </TabButton>
    );

    expect(wrapper.find('button').prop('aria-selected')).toBeTruthy();
  });
});
