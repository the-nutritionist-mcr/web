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

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const LOADING_KEY = 'get-user';

export const AuthenticationProvider = (props: AuthenticationProviderProps) => {
  const { useLoading } = useContext(LoadingContext);
  const { stopLoading, getLoadingState } = useLoading(LOADING_KEY);
  const [user, setUser] = useState<CognitoUser | undefined>();

  const loadUser = async () => {
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
    stopLoading();
  };

  const signIn = async (username: string, password: string) => {
    const response = await login(username, password);
    await loadUser();
    return response;
  };

  const logout = async () => {
    await signOut();
    setUser(undefined);
  };

  useEffect(() => {
    (async () => {
      if (getLoadingState() === 'Started') {
        await loadUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <AuthenticationServiceContext.Provider
      value={{ ...authenticationService, user, signOut: logout, login: signIn }}
    >
      {props.children}
    </AuthenticationServiceContext.Provider>
  );
};
