import Router from 'next/router';
import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { Hub } from 'aws-amplify';
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Layout } from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import { SWRConfig } from 'swr';
import { AuthenticationServiceContext } from '@tnmw/components';
import { NavigationContext } from '@tnmw/utils';

import { theme } from '../theme';

import {
  confirmSignup,
  currentUser,
  login,
  newPasswordChallengeResponse,
  register,
  signOut,
} from '../aws/authenticate';

import '../assets/global.scss';
import { HttpError } from '../backend/lambdas/data-api/http-error';
import { HTTP } from '@tnmw/constants';
import { datadogRum } from '@datadog/browser-rum';

const navigator = {
  navigate: async (path: string) => {
    // eslint-disable-next-line fp/no-mutating-methods
    // await Router.push(path);
    window.location.href = path;
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
  }
});

const datadogAppId = process.env['NX_DATADOG_APP_ID'];
const datadogClientToken = process.env['NX_DATADOG_CLIENT_TOKEN'];

const TnmApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    (async () => {
      if (datadogAppId) {
        datadogRum.init({
          applicationId: datadogAppId,
          clientToken: datadogClientToken,
          site: 'datadoghq.eu',
          service: 'tnm-web',
          env: process.env['NX_APP_ENV'],
          version: process.env['APP_VERSION'],
          sampleRate: 100,
          premiumSampleRate: 100,
          trackInteractions: true,
          defaultPrivacyLevel: 'mask-user-input',
        });

        datadogRum.startSessionReplayRecording();
        const user = await currentUser();

        if (user) {
          const {
            signInUserSession: {
              idToken: {
                payload: {
                  given_name,
                  family_name,
                  email,
                  'cognito:username': username,
                },
              },
            },
          } = user;
          datadogRum.setUser({
            id: username,
            email: email,
            name: `${given_name} ${family_name}`,
          });
        }
      }
    })();
  }, []);
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
              <title>The Nutritionist Manchester</title>
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
