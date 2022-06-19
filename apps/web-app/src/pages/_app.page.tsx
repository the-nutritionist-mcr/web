import Router from 'next/router';
import { FC, useState } from 'react';
import Head from 'next/head';
import { Hub } from 'aws-amplify';
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Layout } from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import { SWRConfig } from 'swr';
import { isClientSide } from '../utils/is-client-side';
import { swrLocalstorageProvider } from '../utils/swr-localstorage-provider';
import { AuthenticationServiceContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';

import { theme } from '../theme';

import {
  confirmSignup,
  login,
  newPasswordChallengeResponse,
  register,
  signOut,
} from '../aws/authenticate';

import '../assets/global.scss';
import { HttpError } from '../backend/lambdas/data-api/http-error';
import { HTTP } from '@tnmw/constants';

const navigator = {
  navigate: async (path: string) => {
    // eslint-disable-next-line fp/no-mutating-methods
    await Router.push(path);
  },
};

const authenticationService = {
  login,
  register,
  signOut,
  confirmSignup,
  newPasswordChallengeResponse,
};

Hub.listen('auth', (data) => {
  switch (data.payload.event) {
    case 'signIn':
      toast.success('Login successful!');
      break;

    case 'signOut':
      toast.success('Successfully logged out');
      break;
  }
});

const TnmApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SWRConfig
      value={{
        onError: (error: Error) => {
          if (
            error instanceof HttpError &&
            error.statusCode === HTTP.statusCodes.Forbidden
          ) {
            // eslint-disable-next-line fp/no-mutating-methods
            Router.push('/login');
          } else {
            toast.error(error.message);
          }
        },
      }}
    >
      <AuthenticationServiceContext.Provider value={authenticationService}>
        <NavigationContext.Provider value={navigator}>
          <ThemeProvider theme={theme}>
            <Head>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
              />
            </Head>
            <Toaster
              toastOptions={{
                style: {
                  fontFamily: 'Roboto',
                  maxWidth: 700,
                },
              }}
            />
            <Layout user={pageProps.user}>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </NavigationContext.Provider>
      </AuthenticationServiceContext.Provider>
    </SWRConfig>
  );
};

export default TnmApp;
