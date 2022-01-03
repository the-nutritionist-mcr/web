import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../theme';
import NotFoundPage from './404.page';

test('The not found page renders without errors', async () => {
  render(
    <ThemeProvider theme={theme}>
      <NotFoundPage />
    </ThemeProvider>
  );
});
