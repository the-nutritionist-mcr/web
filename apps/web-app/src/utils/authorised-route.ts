import { GetServerSideProps } from 'next';
import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { backendRedirect } from './backend-redirect';
import { getUserFromAws } from './get-user-from-aws';
import { BackendCustomer } from '@tnmw/types';

export interface AuthorizedRouteProps {
  user: BackendCustomer & { admin: boolean };
}

interface AuthorizedRouteWrapper {
  (args?: {
    groups?: string[];
    getServerSideProps?: GetServerSideProps<AuthorizedRouteProps>;
  }): GetServerSideProps<AuthorizedRouteProps>;
}

export const authorizedRoute: AuthorizedRouteWrapper = ({
  groups,
  getServerSideProps,
} = {}): GetServerSideProps<AuthorizedRouteProps> => {
  return async (context) => {
    const tokenPair = Object.entries(context.req.cookies).find(([key]) =>
      key.endsWith('.accessToken')
    );

    if (!tokenPair || tokenPair.length !== 2) {
      return backendRedirect('login', 'No .accessToken found');
    }

    const verifyResult = await verifyJwtToken({ token: tokenPair[1] });

    if (!verifyResult.isValid) {
      return backendRedirect(
        'login',
        `Token verification failed: ${verifyResult.error?.message}`
      );
    }

    if (groups?.some((group) => !verifyResult.groups.includes(group))) {
      return backendRedirect(
        'login',
        'Verification was successful, but user is not authorised to access this route'
      );
    }

    return (
      (await getServerSideProps?.(context)) ?? {
        props: {
          user: {
            ...(await getUserFromAws(verifyResult.userName)),
            admin: verifyResult.groups.includes('admin'),
          },
        },
      }
    );
  };
};
