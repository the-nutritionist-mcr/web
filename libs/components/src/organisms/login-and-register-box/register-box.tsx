import { FC } from 'react';
import ConfirmMobileForm from './ConfirmMobileForm';
import RegisterForm from './register-form';
import { RegisterState, useRegisterBox } from './use-register-box';

const getRegisterBox = (_state: RegisterState) => {
  if (_state === RegisterState.DoRegister) {
    return RegisterForm;
  }
  return ConfirmMobileForm;
};

const RegisterBox: FC = () => {
  const { onSubmit, registerState, errorMessage } = useRegisterBox();

  const ChosenRegisterForm = getRegisterBox(registerState);

  return (
    <ChosenRegisterForm
      onSubmit={onSubmit}
      errors={errorMessage ? [errorMessage] : undefined}
    />
  );
};

export default RegisterBox;
