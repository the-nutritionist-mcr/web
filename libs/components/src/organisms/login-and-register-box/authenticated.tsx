import { FC, useContext, useEffect } from 'react';
import { User } from '../../contexts';
import { NavigationContext } from '@tnmw/utils';

export enum Redirect {
  IfLoggedIn,
  IfLoggedOut,
}

interface AuthenticatedProps {
  user: User | undefined;
  redirect: Redirect;
  redirectPath?: string;
}

const Authenticated: FC<AuthenticatedProps> = (props) => {
  const { navigate } = useContext(NavigationContext);

  if (!navigate) {
    throw new Error('Dependencies have not been properly configured');
  }

  useEffect(() => {
    (async () => {
      if (
        (!props.user && props.redirect === Redirect.IfLoggedOut) ||
        (props.user && props.redirect === Redirect.IfLoggedIn)
      ) {
        navigate(props.redirectPath ?? '/login/');
      }
    })();
  }, [props.redirectPath, props.redirect]);

  return <>{props.children}</>;
};

export default Authenticated;
