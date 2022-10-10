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

export const header = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
});

export const text = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  gridColumnStart: '1',
  gridColumnEnd: '3',
  lineHeight: '1.5rem',
});
