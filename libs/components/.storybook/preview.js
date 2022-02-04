import { ThemeProvider } from '@emotion/react';

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

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];
