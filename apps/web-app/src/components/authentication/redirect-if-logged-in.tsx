import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext } from 'react';

interface RedirectIfLoggedInProps {
  redirectTo: string;
  children: ReactNode;
}

const isBrowser = typeof window !== 'undefined';

export const RedirectIfLoggedIn = (props: RedirectIfLoggedInProps) => {
  const { navigate } = useContext(NavigationContext);
  const { isLoading } = useContext(LoadingContext);
  const { user } = useContext(AuthenticationServiceContext);
  const willRedirect = !isLoading && user && isBrowser;

  if (willRedirect) {
    navigate?.(props.redirectTo);
  }
  return <>{willRedirect ? null : props.children}</>;
};
