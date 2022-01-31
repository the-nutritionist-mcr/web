import Router from 'next/router';
import { FC } from 'react';
import { AppProps } from 'next/app';
import { Layout } from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import {
  AuthenticationServiceContext,
  NavigationContext,
} from '@tnmw/components';

import { theme } from '../theme';

import {
  confirmSignup,
  login,
  newPasswordChallengeResponse,
  register,
  signOut,
} from '../aws/authenticate';

import '../assets/global.css';

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

const TnmApp: FC<AppProps> = ({ Component, pageProps }) => (
  <AuthenticationServiceContext.Provider value={authenticationService}>
    <NavigationContext.Provider value={navigator}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </NavigationContext.Provider>
  </AuthenticationServiceContext.Provider>
);

export default TnmApp;
