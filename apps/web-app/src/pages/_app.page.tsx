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
import { ErrorBoundary } from 'react-error-boundary';

import { theme } from '../theme';

import '../assets/global.scss';
import { HttpError } from '../backend/lambdas/data-api/http-error';
import { HTTP } from '@tnmw/constants';
import { DatadogProvider } from '../components/DataDogProvider';
import { AuthenticationProvider } from '../components/authenticationprovider';
import { HubCallback } from '@aws-amplify/core';
import { RouterLoader } from '../components/router-loader';
import { ConfigProvider } from '../components/config-provider';
import { ErrorFallback } from '../components/error-fallback';

const navigator = {
  navigate: async (path: string, withRouter = true) => {
    // eslint-disable-next-line fp/no-mutating-methods
    await Router.push(path);
    // window.location.href = path
  },
  prefetch: (path: string) => {
    Router.prefetch(path);
  },
};

const errorHandler = (error: Error, info: { componentStack: string }) => {
  console.log(error);
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
        <ConfigProvider>
          <AuthenticationProvider>
            <RouterLoader>
              <DatadogProvider>
                <NavigationContext.Provider value={navigator}>
                  <ThemeProvider theme={theme}>
                    <Head>
                      <title>The Nutritionist Manchester</title>
                      <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
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
                    <Layout>
                      <ErrorBoundary
                        fallbackRender={ErrorFallback}
                        onError={errorHandler}
                      >
                        <Component {...pageProps} />
                      </ErrorBoundary>
                    </Layout>
                  </ThemeProvider>
                </NavigationContext.Provider>
              </DatadogProvider>
            </RouterLoader>
          </AuthenticationProvider>
        </ConfigProvider>
      </Loading>
    </SWRConfig>
  );
};

export default TnmApp;
