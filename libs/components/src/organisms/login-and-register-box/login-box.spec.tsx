import { render, screen } from '../../test-support';
import LoginBox from './login-box';
import { mocked } from 'jest-mock';
import { LoginState, useLoginBox } from './use-login-box';

jest.mock('./use-login-box');

describe('The login box', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without errors', () => {
    mocked(useLoginBox).mockReturnValue({
      onSubmit: jest.fn(),
      loginState: LoginState.DoLogin,
      errorMessage: undefined,
    });

    render(<LoginBox />);
  });

  it("renders the change password challenge form when the state is 'ChangePasswordChallenge'", () => {
    mocked(useLoginBox).mockReturnValue({
      onSubmit: jest.fn(),
      loginState: LoginState.ChangePasswordChallenge,
      errorMessage: undefined,
    });

    render(<LoginBox />);
    expect(
      screen.queryByText(
        'You need to change your password. Enter a new one in the box below:'
      )
    ).toBeInTheDocument();
  });

  it("renders the MFA challenge form when the state is 'MFAChallenge'", () => {
    mocked(useLoginBox).mockReturnValue({
      onSubmit: jest.fn(),
      loginState: LoginState.MfaChallenge,
      errorMessage: undefined,
    });

    render(<LoginBox />);
    expect(
      screen.queryByText(
        'A code has been sent to your phone. Please enter it in the box below.'
      )
    ).toBeInTheDocument();
  });
});
