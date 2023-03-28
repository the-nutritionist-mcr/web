import { ErrorResponse } from './types/error-response';
import {
  ChangePasswordAgainData,
  ChangePasswordFormData,
  LoginFormData,
  SrpData,
} from './types/srp-data';
import { useContext, useState } from 'react';
import { AuthenticationServiceContext } from './authentication-service-context';
import { LoginResponse } from './types/login';
import { NavigationContext } from '@tnmw/utils';

export enum LoginState {
  DoLogin = 'DoLogin',
  ChangePasswordChallenge = 'ChangePasswordChallenge',
  MfaChallenge = 'MfaChallenge',
  PasswordresetRequired = 'PasswordResetRequired',
}

const isChangePasswordAgainData = (
  formData: SrpData,
  loginState: LoginState
): formData is ChangePasswordAgainData =>
  Object.prototype.hasOwnProperty.call(formData, 'password') &&
  loginState === LoginState.PasswordresetRequired;

const isChangePasswordData = (
  formData: SrpData,
  loginState: LoginState
): formData is ChangePasswordFormData =>
  Object.prototype.hasOwnProperty.call(formData, 'password') &&
  loginState === LoginState.ChangePasswordChallenge;

const isLoginData = (
  formData: SrpData,
  loginState: LoginState
): formData is LoginFormData =>
  Object.prototype.hasOwnProperty.call(formData, 'email') &&
  loginState === LoginState.DoLogin;

export const useLoginBox = () => {
  const { login, newPasswordChallengeResponse, forgotPassword } = useContext(
    AuthenticationServiceContext
  );
  const { navigate } = useContext(NavigationContext);
  if (!login || !newPasswordChallengeResponse || !navigate || !forgotPassword) {
    throw new Error('Dependencies not configured!');
  }

  const [errorMessage, setErrorMessage] = useState<ErrorResponse | undefined>();
  const [loginState, setLoginState] = useState<LoginState>(LoginState.DoLogin);
  const [response, setResponse] = useState<LoginResponse>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const onSubmit = async (data: SrpData) => {
    setErrorMessage(undefined);
    try {
      if (isLoginData(data, loginState)) {
        setPassword(data.password);
        setEmail(data.email);
        const loginResponse = await login(data.email, data.password);
        setResponse(loginResponse);
        if (loginResponse.challengeName === 'SMS_MFA') {
          setLoginState(LoginState.MfaChallenge);
          return;
        }
        if (loginResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setLoginState(LoginState.ChangePasswordChallenge);
          return;
        }

        if (loginResponse.success) {
          await navigate('/account/', false);
        }
      }

      if (isChangePasswordData(data, loginState)) {
        const newPasswordResponse = await newPasswordChallengeResponse(
          response,
          data.password
        );

        if (newPasswordResponse.success) {
          // await waitForAuthEvent('signIn');
          await navigate('/account/', false);
        }
      }

      if (isChangePasswordAgainData(data, loginState)) {
        await forgotPassword(email ?? '', password ?? '', data.password);
        const loginResponse = await login(email ?? '', data.password);

        if (loginResponse.success) {
          // await waitForAuthEvent('signIn');
          await navigate('/account/', false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'PasswordResetRequiredException') {
          console.log(JSON.stringify(error, null, 2));
          setLoginState(LoginState.PasswordresetRequired);
        } else {
          setErrorMessage({ message: error.message });
          console.log(error);
        }
      }
    }
  };
  return { errorMessage, onSubmit, loginState };
};
