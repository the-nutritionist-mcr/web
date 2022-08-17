import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext } from 'react';
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

  const hasFinishedLoadingUser = getLoadingState(LOADING_KEY) === 'Finished';

  const { user } = useContext(AuthenticationServiceContext);

  if (
    isBrowser &&
    hasFinishedLoadingUser &&
    (!user ||
      (props.allowedGroups &&
        !user.signInUserSession.accessToken.payload['cognito:groups'].some(
          (group) => props.allowedGroups.includes(group)
        )))
  ) {
    console.log(`redirect to${props.redirectTo}`);
    navigate(props.redirectTo);
  }
  return <>{props.children}</>;
};
