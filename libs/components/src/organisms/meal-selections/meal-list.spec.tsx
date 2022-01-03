import { shallow } from 'enzyme';
import MealList from './meal-list';
import MealCounter from './meal-counter';

describe('The <MealList> component', () => {
  it('renders without errors', () => {
    shallow(
      <MealList things={[]} selected={{}} setSelected={jest.fn()} max={0} />
    );
  });

  it('renders each of the meals into a meals into a <MealCounter />', () => {
    const wrapper = shallow(
      <MealList
        things={[
          {
            id: '1',
            title: 'foo',
            description: 'baz',
          },

          {
            id: '2',
            title: 'foobar',
            description: 'bazBash',
          },
        ]}
        selected={{}}
        setSelected={jest.fn()}
        max={0}
      />
    );

    expect(
      wrapper
        .find(MealCounter)
        .findWhere((counter) => counter.prop('title') === 'foo')
    ).toHaveLength(1);

    expect(
      wrapper
        .find(MealCounter)
        .findWhere((counter) => counter.prop('description') === 'baz')
    ).toHaveLength(1);

    expect(
      wrapper
        .find(MealCounter)
        .findWhere((counter) => counter.prop('title') === 'foobar')
    ).toHaveLength(1);

    expect(
      wrapper
        .find(MealCounter)
        .findWhere((counter) => counter.prop('description') === 'bazBash')
    ).toHaveLength(1);
  });
});
