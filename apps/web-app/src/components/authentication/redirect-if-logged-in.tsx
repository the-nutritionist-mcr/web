import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext, useEffect } from 'react';

interface RedirectIfLoggedInProps {
  redirectTo: string;
  children: ReactNode;
}

const isBrowser = typeof window !== 'undefined';

export const RedirectIfLoggedIn = (props: RedirectIfLoggedInProps) => {
  const { isLoading } = useContext(LoadingContext);
  const { user } = useContext(AuthenticationServiceContext);
  const willRedirect = !isLoading && user && isBrowser;

  useEffect(() => {
    if (willRedirect) {
      console.debug(`Redirecting to ${props.redirectTo}`);
      window.location.href = props.redirectTo;
    }
  }, [willRedirect]);

  return <>{willRedirect ? null : props.children}</>;
};
