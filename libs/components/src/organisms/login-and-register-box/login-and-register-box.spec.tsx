import React from 'react';
import { AuthenticationServiceContext } from './authentication-service-context';

import { render, act, screen } from '@testing-library/react';
import { ThemeProvider, Theme } from '@emotion/react';

import userEvent from '@testing-library/user-event';
import LoginAndRegisterBox from './login-and-register-box';
import { NavigationContext } from '@tnmw/utils';

const theme: Theme = {
  colors: {
    buttonBlack: 'black',
    labelText: 'black',
  },
  menubarHeight: 100,
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

const mockAuthServices = {
  register: jest.fn(),
  login: jest.fn(),
  newPasswordChallengeResponse: jest.fn(),
  confirmSignup: jest.fn(),
};

describe('The login and register box', () => {
  it('renders without error', () => {
    render(
      <ThemeProvider theme={theme}>
        <NavigationContext.Provider value={{ navigate: jest.fn() }}>
          <AuthenticationServiceContext.Provider value={mockAuthServices}>
            <LoginAndRegisterBox defaultTab="Login" />
          </AuthenticationServiceContext.Provider>
        </NavigationContext.Provider>
      </ThemeProvider>
    );
  });

  it('Changes the history bar if you click on a tab', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState');
    render(
      <ThemeProvider theme={theme}>
        <NavigationContext.Provider value={{ navigate: jest.fn() }}>
          <AuthenticationServiceContext.Provider value={mockAuthServices}>
            <LoginAndRegisterBox defaultTab="Login" />
          </AuthenticationServiceContext.Provider>
        </NavigationContext.Provider>
      </ThemeProvider>
    );

    const registerTab = screen.getByRole('tab', { name: 'Register' });

    act(() => userEvent.click(registerTab));

    // eslint-disable-next-line unicorn/no-null
    expect(replaceStateSpy).toBeCalledWith(null, '', '/register/');
  });
});
