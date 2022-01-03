import { shallow } from 'enzyme';
import MealCounter from './meal-counter';
import { QuantityStepper } from '../../molecules';
import { ParagraphText } from '../../atoms';
import { render, screen } from '@testing-library/react';

describe('The <MealCounter> component', () => {
  it('renders without errors', () => {
    shallow(<MealCounter title="foo" description="bar" />);
  });

  it('renders the title', () => {
    const wrapper = shallow(<MealCounter title="foo" description="bar" />);

    expect(wrapper.text()).toInclude('foo');
  });

  it('Sets the title as the accessible name', () => {
    render(<MealCounter title="foo-title" description="bar" />);
    const counter = screen.getByRole('region');
    expect(counter).toHaveAccessibleName('foo-title');
  });

  it('renders the description', () => {
    const wrapper = shallow(<MealCounter title="foo" description="bar" />);

    expect(
      wrapper
        .find(ParagraphText)
        .findWhere((text) => text.prop('children') === 'bar')
    ).toHaveLength(1);
  });

  it('passes the value, max, min and onChange through to the quantity-stepper', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <MealCounter
        title="foo"
        description="bar"
        min={2}
        max={4}
        value={3}
        onChange={onChange}
      />
    );

    const stepper = wrapper.find(QuantityStepper);

    expect(stepper.prop('max')).toEqual(4);
    expect(stepper.prop('min')).toEqual(2);
    expect(stepper.prop('value')).toEqual(3);
    expect(stepper.prop('onChange')).toEqual(onChange);
  });
});
