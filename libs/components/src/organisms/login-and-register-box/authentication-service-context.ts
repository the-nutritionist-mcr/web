import { createContext } from 'react';
import { ConfirmSignupFunction } from './types/confirm-signup';

import { LoginFunc } from './types/login';
import { NewPasswordChallengeResponseFunc } from './types/new-password-challenge-response';
import { RegisterFunc, ForgotPasswordFunc } from './types/register';

export interface CognitoUser {
  isAdmin: boolean;
  signInUserSession: {
    idToken: {
      jwtToken: string;
      payload: {
        given_name: string;
        family_name: string;
        email: string;
        'cognito:username': string;
      };
    };
    accessToken: {
      jwtToken: string;
      payload: {
        'cognito:groups': string[];
      };
    };
  };
}

export type LogoutFunc = () => Promise<void>;

export interface AuthenticationContextType {
  login?: LoginFunc;
  register?: RegisterFunc;
  confirmSignup?: ConfirmSignupFunction;
  newPasswordChallengeResponse?: NewPasswordChallengeResponseFunc;
  user?: CognitoUser;
  forgotPassword?: ForgotPasswordFunc;
  waitForAuthEvent?: (name: string) => Promise<void>;
  signOut?: LogoutFunc;
}

export const AuthenticationServiceContext =
  createContext<AuthenticationContextType>({});
