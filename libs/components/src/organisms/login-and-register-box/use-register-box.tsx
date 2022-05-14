import { ErrorResponse } from './types/error-response';
import { MfaFormData, RegisterFormData, SrpData } from './types/srp-data';
import { useContext, useState } from 'react';
import { AuthenticationServiceContext } from './authentication-service-context';
import { RegisterFunc } from './types/register';
import { NavigationContext } from '@tnmw/utils';

export enum RegisterState {
  DoRegister = 'DoRegister',
  ConfirmMobile = 'ConfirmMobile',
}

const isRegister = (
  _data: SrpData,
  state: RegisterState
): _data is RegisterFormData => state === RegisterState.DoRegister;

const isConfirm = (
  _data: SrpData,
  state: RegisterState
): _data is MfaFormData => state === RegisterState.ConfirmMobile;

const callRegister = async (
  data: RegisterFormData,
  registerFunc: RegisterFunc
) => {
  const address = [
    data.addressLine1,
    data.addressLine2,
    data.county,
    data.townOrCity,
    data.postcode,
  ]
    .filter(Boolean)
    .join('\n');

  return registerFunc(
    data.username,
    data.password,
    data.saluation,
    data.email,
    data.firstName,
    data.surname,
    address,
    data.telephone
  );
};

export const useRegisterBox = () => {
  const { login, register, confirmSignup } = useContext(
    AuthenticationServiceContext
  );
  const { navigate } = useContext(NavigationContext);

  if (!login || !register || !confirmSignup || !navigate) {
    throw new Error('Dependencies not initailised properly!');
  }

  const [errorMessage, setErrorMessage] = useState<ErrorResponse | undefined>();

  const [registerState, setRegisterState] = useState<RegisterState>(
    RegisterState.DoRegister
  );

  const [registerData, setRegisterData] = useState<
    RegisterFormData | undefined
  >();

  const onSubmit = async (data: SrpData) => {
    try {
      if (isRegister(data, registerState)) {
        const result = await callRegister(data, register);
        if (!result.userConfirmed) {
          setRegisterState(RegisterState.ConfirmMobile);
        }
        setRegisterData(data);
      } else if (isConfirm(data, registerState)) {
        const result = await confirmSignup(
          registerData?.username ?? '',
          data.code
        );
        if (result === 'SUCCESS') {
          await login(
            registerData?.username ?? '',
            registerData?.password ?? ''
          );
          navigate('/account/');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage({ message: error.message });
      }
    }
  };

  return { errorMessage, registerState, onSubmit };
};
