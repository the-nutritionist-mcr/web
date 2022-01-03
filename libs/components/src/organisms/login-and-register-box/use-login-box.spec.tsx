import { SrpData } from './types/srp-data';
import { mockDependencies } from '../../test-support';
import { act, renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import { LoginState } from './login-box';
import { useLoginBox } from './use-login-box';

afterEach(() => jest.resetAllMocks());

test('use login hook Sets an error message if an error is thrown by login', async () => {
  const login = jest.fn();
  mockDependencies({ login });

  login.mockRejectedValue(new Error('AN ERROR!'));

  const { result } = renderHook(() => useLoginBox());

  await act(async () => result.current.onSubmit({ email: 'foo' } as SrpData));

  expect(result.current.errorMessage).toEqual({ message: 'AN ERROR!' });
});

test('use login hook Sets the state to MfaChallenge if an MfaChallenge is returned from the login', async () => {
  const login = jest.fn();
  mockDependencies({ login });

  when(login).calledWith('foo@bar.com', 'foo').mockResolvedValue({
    challengeName: 'SMS_MFA',
  });

  const { result } = renderHook(() => useLoginBox());

  await act(async () =>
    result.current.onSubmit({ email: 'foo@bar.com', password: 'foo' })
  );

  expect(result.current.loginState).toEqual(LoginState.MfaChallenge);
});

test('use login hook Sets the state to changePasswordChallenge if a changePasswordChallenge is returned from login', async () => {
  const login = jest.fn();
  mockDependencies({ login });

  when(login).calledWith('foo@bar.com', 'foo').mockResolvedValue({
    challengeName: 'NEW_PASSWORD_REQUIRED',
  });

  const { result } = renderHook(() => useLoginBox());

  await act(async () =>
    result.current.onSubmit({ email: 'foo@bar.com', password: 'foo' })
  );

  expect(result.current.loginState).toEqual(LoginState.ChangePasswordChallenge);
});

test('Redirects to the account page if login is succesful after login state', async () => {
  const login = jest.fn();
  const navigate = jest.fn();
  mockDependencies({ login, navigate });

  when(login).calledWith('foo@bar.com', 'foo').mockResolvedValue({
    success: true,
  });

  const { result } = renderHook(() => useLoginBox());

  await act(async () =>
    result.current.onSubmit({ email: 'foo@bar.com', password: 'foo' })
  );

  expect(navigate).toBeCalledWith('/account/');
});

test('Redirects to the account page if login is succesful after changing password', async () => {
  const login = jest.fn();
  const navigate = jest.fn();
  const newPasswordChallengeResponse = jest.fn();
  mockDependencies({ login, navigate, newPasswordChallengeResponse });

  const loginResponse = {
    challengeName: 'NEW_PASSWORD_REQUIRED',
  };

  when(login)
    .calledWith('foo@bar.com', 'foo-password')
    .mockResolvedValue(loginResponse);

  when(newPasswordChallengeResponse)
    .calledWith(loginResponse, 'new-password')
    .mockResolvedValue({
      success: true,
    });

  const { result } = renderHook(() => useLoginBox());

  await act(async () =>
    result.current.onSubmit({ email: 'foo@bar.com', password: 'foo-password' })
  );

  await act(async () => result.current.onSubmit({ password: 'new-password' }));

  expect(navigate).toBeCalledWith('/account/');
});
