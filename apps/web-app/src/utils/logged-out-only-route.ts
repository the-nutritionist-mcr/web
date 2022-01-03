import { GetServerSideProps } from 'next';
import { verifyJwtToken } from '@tnmw/verify-jwt';
import { backendRedirect } from './backend-redirect';

export const loggedOutOnlyRoute = (
  redirectTo: string,
  serverSidePropsCallback?: GetServerSideProps
): GetServerSideProps => {
  return async (context) => {
    const tokenPair = Object.entries(context.req.cookies).find(([key]) =>
      key.endsWith('.accessToken')
    );

    if (!tokenPair || tokenPair.length !== 2) {
      return (await serverSidePropsCallback?.(context)) ?? { props: {} };
    }

    const verifyResult = await verifyJwtToken(tokenPair[1]);

    if (verifyResult.isValid) {
      return backendRedirect(
        redirectTo,
        'Route is only available to logged out users'
      );
    }

    return (await serverSidePropsCallback?.(context)) ?? { props: {} };
  };
};
