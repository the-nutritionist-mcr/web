import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import Account from './account.page';
import { theme } from '../theme';

describe('The account page', () => {
  it('renders without error', () => {
    render(
      <ThemeProvider theme={theme}>
        <Account />
      </ThemeProvider>
    );
  });
});
