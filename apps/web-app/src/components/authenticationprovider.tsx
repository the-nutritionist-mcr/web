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

export const LOADING_KEY = 'get-user';

export const AuthenticationProvider = (props: AuthenticationProvider) => {
  const [loaded, setLoaded] = useState(false);
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [user, setUser] = useState<CognitoUser | undefined>();
  useEffect(() => {
    if (!loaded) {
      startLoading(LOADING_KEY);
      (async () => {
        const foundUser = await currentUser();
        setUser(
          foundUser && {
            ...foundUser,
            isAdmin:
              foundUser?.signInUserSession?.accessToken?.payload[
                'cognito:groups'
              ]?.includes('admin'),
          }
        );
        setLoaded(true);
      })();
    } else {
      stopLoading(LOADING_KEY);
    }
  }, [user, loaded]);
  return (
    <AuthenticationServiceContext.Provider
      value={{ ...authenticationService, user }}
    >
      {props.children}
    </AuthenticationServiceContext.Provider>
  );
};
