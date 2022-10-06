import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext, useEffect, useLayoutEffect } from 'react';
import { LOADING_KEY } from '../authenticationprovider';

interface RedirectIfLoggedOutProps {
  allowedGroups?: string[];
  redirectTo: string;
  children: ReactNode;
}

const isBrowser = typeof window !== 'undefined';

export const RedirectIfLoggedOut = (props: RedirectIfLoggedOutProps) => {
  const { navigate } = useContext(NavigationContext);
  const { getLoadingState } = useContext(LoadingContext);

  console.log('one');
  const hasFinishedLoadingUser = getLoadingState(LOADING_KEY) === 'Finished';

  const { user } = useContext(AuthenticationServiceContext);

  const willRedirect =
    isBrowser &&
    hasFinishedLoadingUser &&
    (!user ||
      (props.allowedGroups &&
        !user.signInUserSession.accessToken.payload['cognito:groups'].some(
          (group) => props?.allowedGroups?.includes(group)
        )));

  useEffect(() => {
    console.log('check again');
    if (willRedirect) {
      console.log({ isBrowser, hasFinishedLoadingUser, user });
      console.log(`redirect to ${props.redirectTo}`);
      navigate?.(props.redirectTo, false);
    }
  }, [hasFinishedLoadingUser, navigate, props.redirectTo, user, willRedirect]);
  return <>{willRedirect ? null : props.children}</>;
};
