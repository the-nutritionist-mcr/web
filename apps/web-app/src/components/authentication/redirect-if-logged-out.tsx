import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext } from 'react';

interface RedirectIfLoggedOutProps {
  allowedGroups?: string[];
  redirectTo: string;
  children: ReactNode;
}

const isBrowser = typeof window !== 'undefined';

export const RedirectIfLoggedOut = (props: RedirectIfLoggedOutProps) => {
  const { navigate } = useContext(NavigationContext);
  const { isLoading } = useContext(LoadingContext);
  const { user } = useContext(AuthenticationServiceContext);
  if (
    isBrowser &&
    !isLoading &&
    (!user ||
      (props.allowedGroups &&
        !user.signInUserSession.accessToken.payload['cognito:groups'].some(
          (group) => props.allowedGroups.includes(group)
        )))
  ) {
    navigate(props.redirectTo);
  }
  return <>{props.children}</>;
};
