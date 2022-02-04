import Router from 'next/router';
import { FC } from 'react';
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Layout } from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import { SWRConfig } from 'swr';
import { isClientSide } from '../utils/is-client-side';
import { swrLocalstorageProvider } from '../utils/swr-localstorage-provider';
import {
  AuthenticationServiceContext,
  NavigationContext
} from '@tnmw/components';

import { theme } from '../theme';

import {
  confirmSignup,
  login,
  newPasswordChallengeResponse,
  register,
  signOut
} from '../aws/authenticate';

import '../assets/global.css';

const navigator = {
  navigate: async (path: string) => {
    // eslint-disable-next-line fp/no-mutating-methods
    await Router.push(path);
  }
};

const authenticationService = {
  login,
  register,
  signOut,
  confirmSignup,
  newPasswordChallengeResponse
};

const provider = isClientSide() ? swrLocalstorageProvider : undefined;

const TnmApp: FC<AppProps> = ({ Component, pageProps }) => (
  <SWRConfig
    value={{
      provider,
      onError: (error: Error) => {
        toast.error(error.message);
      }
    }}
  >
    <AuthenticationServiceContext.Provider value={authenticationService}>
      <NavigationContext.Provider value={navigator}>
        <ThemeProvider theme={theme}>
          <Toaster 

          toastOptions={{
            style: {
              fontFamily: 'Roboto',
              fontSize: '14pt',
            },
          }}/>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NavigationContext.Provider>
    </AuthenticationServiceContext.Provider>
  </SWRConfig>
);

export default TnmApp;
