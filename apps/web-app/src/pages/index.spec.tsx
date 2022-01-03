import { render } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import Index from './index.page';
import { theme } from '../theme';

test('Renders without error', async () => {
  render(
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  );
});
