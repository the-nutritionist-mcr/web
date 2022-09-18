import { style } from '@vanilla-extract/css';

export const sectionContents = style({
  borderTop: '1px dashed #b8b8b8',
  width: '100%',
  display: 'flex',
  paddingTop: '1.2rem',
});

export const chooseButtonContainer = style({
  marginBottom: '3.1rem',
});

export const notSupportedMessage = style({
  '@media': {
    'screen and (min-width: 900px)': {
      display: 'none',
    },
  },
});

export const accountContainer = style({
  '@media': {
    'screen and (max-width: 900px)': {
      width: '100%',
      padding: '1rem',
    },
  },
});

export const notSupportedTitle = style({
  fontSize: '2rem',
  marginBottom: '1rem',
  fontFamily: '"Accumin Pro", Arial, sans-serif;',
});
