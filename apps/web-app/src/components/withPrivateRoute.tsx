import Router from 'next/router';
import { currentUser } from '../aws/authenticate';

const login = '/login';

const checkUserAuthentication = () => {
  const token =
    typeof window !== 'undefined' && localStorage.getItem('test_token');
  if (!token) {
    return { auth: null };
  } else return { auth: true };
};

export default (WrappedComponent: React.ElementType) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    const foundUser = await currentUser();

    // Are you an authorized user or not?
    if (foundUser) {
      // Handle server-side and client-side rendering.
      Router.replace(`/login?from=${encodeURIComponent(Router.asPath)}`);
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
      });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
