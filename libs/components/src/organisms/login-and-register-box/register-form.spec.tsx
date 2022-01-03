import { render } from '../../test-support';
import RegisterForm from './register-form';

describe('The <RegisterForm> component', () => {
  it('renders without errors', () => {
    const onSubmit = jest.fn();
    render(<RegisterForm onSubmit={onSubmit} />);
  });
});
