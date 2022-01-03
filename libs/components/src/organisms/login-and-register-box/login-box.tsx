import { FC } from 'react';
import LoginForm from './login-form';
import MfaForm from './mfa-form';
import NewPasswordForm from './new-password-form';
import { useLoginBox } from './use-login-box';

export enum LoginState {
  DoLogin = 'DoLogin',
  ChangePasswordChallenge = 'ChangePasswordChallenge',
  MfaChallenge = 'MfaChallenge',
}

const getLoginBox = (state: LoginState) => {
  switch (state) {
    case LoginState.DoLogin:
      return LoginForm;
    case LoginState.ChangePasswordChallenge:
      return NewPasswordForm;
    case LoginState.MfaChallenge:
      return MfaForm;
  }
};

const LoginBox: FC = () => {
  const { errorMessage, onSubmit, loginState } = useLoginBox();
  const ChosenLoginForm = getLoginBox(loginState);

  return (
    <ChosenLoginForm
      errors={errorMessage ? [errorMessage] : undefined}
      onSubmit={onSubmit}
    />
  );
};
export default LoginBox;
