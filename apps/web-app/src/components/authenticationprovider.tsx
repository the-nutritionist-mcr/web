import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { Hub } from 'aws-amplify';
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

  useEffect(() => {
    Hub.listen('auth', loadUser);
    (async () => {
      if (getLoadingState() === 'Started') {
        await loadUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => Hub.remove('auth', loadUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <AuthenticationServiceContext.Provider
      value={{ ...authenticationService, user }}
    >
      {props.children}
    </AuthenticationServiceContext.Provider>
  );
};
