import { createTheme, createThemeContract } from '@vanilla-extract/css';

const vars = createThemeContract({
  colors: {
    callToAction: 'color-call-to-action',
    buttonBlack: 'colors-button-black',
    labelText: 'colors-label-text',
  },
  menubarHeight: 'menu-bar-height',
  breakpoints: {
    small: {
      end: 'breakpoints-small-end',
    },
    medium: {
      start: 'breakpoints-medium-start',
      end: 'breakpoints-medium-end',
    },
    large: {
      start: 'breakpoints-large-start',
    },
  },
});

export const theme = createTheme(vars, {
  colors: {
    callToAction: '#3b7d7a',
    buttonBlack: '#292929',
    labelText: '#141414',
  },
  menubarHeight: '88px',
  breakpoints: {
    small: {
      end: '400px',
    },
    medium: {
      start: '401px',
      end: '900px',
    },
    large: {
      start: '601px',
    },
  },
});
