import { render, screen } from '../../test-support';
import RegisterBox from './register-box';
import { mocked } from 'jest-mock';
import { RegisterState, useRegisterBox } from './use-register-box';

jest.mock('./use-register-box');

describe('The register box', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without errors', () => {
    mocked(useRegisterBox).mockReturnValue({
      onSubmit: jest.fn(),
      registerState: RegisterState.DoRegister,
      errorMessage: undefined,
    });

    render(<RegisterBox />);
  });

  it('renders the mobile challenge form if the state is confirm mobile', () => {
    mocked(useRegisterBox).mockReturnValue({
      onSubmit: jest.fn(),
      registerState: RegisterState.ConfirmMobile,
      errorMessage: undefined,
    });

    render(<RegisterBox />);

    expect(
      screen.queryByText(
        'Signup was successful. To verify your phone number, please enter the code that was sent to your phone in the box below:'
      )
    ).toBeInTheDocument();
  });
});
