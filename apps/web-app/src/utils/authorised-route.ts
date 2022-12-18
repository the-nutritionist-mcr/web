import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from 'next';
import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { backendRedirect } from './backend-redirect';
import { getUserFromAws } from './get-user-from-aws';
import { BackendCustomer } from '@tnmw/types';
import { ParsedUrlQuery } from 'node:querystring';

export interface AuthorizedRouteProps {
  user: BackendCustomer & { admin: boolean };
}

interface AuthorizedRouteWrapper {
  (args?: {
    groups?: string[];
    getServerSideProps?: GetServerSideProps<AuthorizedRouteProps>;
  }): GetServerSideProps<AuthorizedRouteProps>;
}

const getCookie = <Q extends ParsedUrlQuery, D extends PreviewData>(
  context: GetServerSidePropsContext<Q, D>,
  callback: (key: string, value: string) => boolean
) =>
  Object.entries(context.req.cookies).find(([key, value]) =>
    callback(key, value ?? '')
  )?.[1];

export const authorizedRoute: AuthorizedRouteWrapper = ({
  groups,
  getServerSideProps,
} = {}): GetServerSideProps<AuthorizedRouteProps> => {
  return async (context) => {
    const userId = getCookie(context, (key) => key.endsWith('LastAuthUser'));

    const token = getCookie(context, (key) =>
      key.endsWith(`${userId}.accessToken`)
    );

    if (!token) {
      return backendRedirect('login', 'No .accessToken found');
    }

    const verifyResult = await verifyJwtToken({ token: token });

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
            groups: verifyResult.groups,
          },
        },
      }
    );
  };
};
