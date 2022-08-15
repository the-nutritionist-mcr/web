import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { ReactNode, useContext, useEffect, useState } from 'react';

import {
  confirmSignup,
  currentUser,
  login,
  newPasswordChallengeResponse,
  forgotPassword,
  register,
  signOut,
  CognitoUser,
} from '../aws/authenticate';

const authenticationService = {
  login,
  register,
  signOut,
  confirmSignup,
  forgotPassword,
  newPasswordChallengeResponse,
};

interface AuthenticationProvider {
  children: ReactNode;
}

const LOADING_KEY = 'get-user';

export const AuthenticationProvider = (props: AuthenticationProvider) => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [user, setUser] = useState<CognitoUser | undefined>();
  useEffect(() => {
    (async () => {
      console.log('STARTING');
      startLoading(LOADING_KEY);
      const foundUser = await currentUser();
      setUser(foundUser);
      stopLoading(LOADING_KEY);
      console.log('STOPPING');
    })();
  }, []);
  return (
    <AuthenticationServiceContext.Provider
      value={{ ...authenticationService, user }}
    >
      {props.children}
    </AuthenticationServiceContext.Provider>
  );
};
