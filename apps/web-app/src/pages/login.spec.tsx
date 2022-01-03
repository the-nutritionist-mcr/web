import { render } from '@testing-library/react';
import {
  NavigationContext,
  AuthenticationServiceContext,
  NavigationContextType,
  AuthenticationContextType,
} from '@tnmw/components';
import { ThemeProvider } from '@emotion/react';
import Login from './login.page';
import { theme } from '../theme';
import { mock } from 'jest-mock-extended';

const mockNavigation = mock<NavigationContextType>();
const mockAuthService = mock<AuthenticationContextType>();

test('Renders without error', async () => {
  render(
    <AuthenticationServiceContext.Provider value={mockAuthService}>
      <NavigationContext.Provider value={mockNavigation}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </NavigationContext.Provider>
    </AuthenticationServiceContext.Provider>
  );
});
