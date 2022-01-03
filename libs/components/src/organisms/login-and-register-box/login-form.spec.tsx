import { shallow } from 'enzyme';
import { Input } from '../../atoms';

import LoginForm from './login-form';

describe('The login form', () => {
  it('renders an input for email and password', () => {
    const wrapper = shallow(<LoginForm />);

    expect(
      wrapper.find(Input).findWhere((input) => input.prop('name') === 'email')
    ).toHaveLength(1);

    expect(
      wrapper
        .find(Input)
        .findWhere((input) => input.prop('name') === 'password')
    ).toHaveLength(1);
  });
});
