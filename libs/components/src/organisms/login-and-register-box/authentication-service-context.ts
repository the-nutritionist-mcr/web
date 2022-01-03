import { createContext } from 'react';
import { ConfirmSignupFunction } from './types/confirm-signup';

import { LoginFunc } from './types/login';
import { NewPasswordChallengeResponseFunc } from './types/new-password-challenge-response';
import { RegisterFunc } from './types/register';

export interface AuthenticationContextType {
  login?: LoginFunc;
  register?: RegisterFunc;
  confirmSignup?: ConfirmSignupFunction;
  newPasswordChallengeResponse?: NewPasswordChallengeResponseFunc;
}

export const AuthenticationServiceContext =
  createContext<AuthenticationContextType>({});
