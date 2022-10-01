import { style } from '@vanilla-extract/css';

export const padding = style({
  padding: '1.5rem 5rem 3rem 5rem',
  '@media': {
    'screen and (max-width: 599px)': {
      padding: '1.5rem 3rem 3rem 3rem',
    },
  },
});
