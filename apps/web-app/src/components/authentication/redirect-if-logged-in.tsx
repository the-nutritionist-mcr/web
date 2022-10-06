import { AuthenticationServiceContext, LoadingContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';
import { ReactNode, useContext, useEffect } from 'react';

interface RedirectIfLoggedInProps {
  redirectTo: string;
  children: ReactNode;
}

const isBrowser = typeof window !== 'undefined';

export const RedirectIfLoggedIn = (props: RedirectIfLoggedInProps) => {
  console.log('two');
  const { navigate } = useContext(NavigationContext);
  const { isLoading } = useContext(LoadingContext);
  const { user } = useContext(AuthenticationServiceContext);
  const willRedirect = !isLoading && user && isBrowser;

  useEffect(() => {
    if (willRedirect) {
      navigate?.(props.redirectTo);
    }
  }, [willRedirect]);

  return <>{willRedirect ? null : props.children}</>;
};
