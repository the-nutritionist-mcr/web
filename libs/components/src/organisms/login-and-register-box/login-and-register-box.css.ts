import { style } from '@vanilla-extract/css';

export const tabButtonBox = style({
  width: '100%',
});

export const padding = style({
  textAlign: 'left',
  width: '100%',
  padding: '1.5rem 5rem 3rem 5rem',
  '@media': {
    'screen and (max-width: 599px)': {
      padding: '1.5rem 3rem 3rem 3rem',
    },
  },
});
