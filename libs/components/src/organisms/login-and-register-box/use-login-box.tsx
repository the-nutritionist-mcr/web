import { ErrorResponse } from './types/error-response';
import {
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
}

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
  const { login, newPasswordChallengeResponse } = useContext(
    AuthenticationServiceContext
  );
  const { navigate } = useContext(NavigationContext);
  if (!login || !newPasswordChallengeResponse || !navigate) {
    throw new Error('Dependencies not configured!');
  }

  const [errorMessage, setErrorMessage] = useState<ErrorResponse | undefined>();
  const [loginState, setLoginState] = useState<LoginState>(LoginState.DoLogin);
  const [response, setResponse] = useState<LoginResponse>();
  const onSubmit = async (data: SrpData) => {
    try {
      if (isLoginData(data, loginState)) {
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
          await navigate('/account/');
        }
      }

      if (isChangePasswordData(data, loginState)) {
        const newPasswordResponse = await newPasswordChallengeResponse(
          response,
          data.password
        );

        if (newPasswordResponse.success) {
          await navigate('/account/');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage({ message: error.message });
        console.log(error);
      }
    }
  };
  return { errorMessage, onSubmit, loginState };
};
