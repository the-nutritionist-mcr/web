import Router from 'next/router';
import { FC, useEffect } from 'react';
import Head from 'next/head';
import { Hub } from 'aws-amplify';
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Layout, Loading } from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import { SWRConfig } from 'swr';
import { NavigationContext } from '@tnmw/utils';

import { theme } from '../theme';

import '../assets/global.scss';
import { HttpError } from '../backend/lambdas/data-api/http-error';
import { HTTP } from '@tnmw/constants';
import { DatadogProvider } from '../components/DataDogProvider';
import { AuthenticationProvider } from '../components/authenticationprovider';
import { HubCallback } from '@aws-amplify/core';

const navigator = {
  navigate: async (path: string, withRouter = true) => {
    if (withRouter) {
      // eslint-disable-next-line fp/no-mutating-methods
      await Router.push(path);
    } else {
      window.location.href = path;
    }
  },
};

const TnmApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const callback: HubCallback = (data) => {
      switch (data.payload.event) {
        case 'signIn':
          toast.success('Login successful!');
          break;
      }
    };

    Hub.listen('auth', callback);
    return () => Hub.remove('auth', callback);
  }, []);
  return (
    <SWRConfig
      value={{
        onError: (error: Error) => {
          if (
            error instanceof HttpError &&
            error.statusCode === HTTP.statusCodes.Forbidden
          ) {
            navigator.navigate('/login', false);
          } else {
            toast.error(error.message);
          }
        },
      }}
    >
      <Loading>
        <AuthenticationProvider>
          <DatadogProvider>
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
          </DatadogProvider>
        </AuthenticationProvider>
      </Loading>
    </SWRConfig>
  );
};

export default TnmApp;
