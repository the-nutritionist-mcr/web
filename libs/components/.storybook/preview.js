import React from "react"
import { ThemeProvider } from '@emotion/react';

import {
  AuthenticationServiceContext,
  NavigationContext
} from '../src/organisms';

export const theme = {
  colors: {
    buttonBlack: '#292929',
    labelText: '#141414',
  },
  menubarHeight: 88,
  breakpoints: {
    small: {
      end: 400,
    },
    medium: {
      start: 401,
      end: 900,
    },
    large: {
      start: 601,
    },
  },
};

const mockAuthenticationService = {
  confirmSignup: () => {},
  login: () => {},
  newPasswordChallengeResponse: () => {},
  register: () => {},
  signOut: () => {}
}

const mockNavigationService = {
  navigate: () => {}
}

export const decorators = [
  (Story) => (
    <AuthenticationServiceContext.Provider value={mockAuthenticationService}>
      <NavigationContext.Provider value={mockNavigationService}>
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </NavigationContext.Provider>
    </AuthenticationServiceContext.Provider>
  ),
];
