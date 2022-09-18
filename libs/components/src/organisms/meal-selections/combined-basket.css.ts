import { style } from '@vanilla-extract/css';

export const selectedBox = style({
  margin: '1rem',
  padding: '1rem',
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: '25rem',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'none',
    },
  },
});

export const basketHeader = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontSize: '1.7rem',
  fontWeight: 'bold',
  margin: 0,
  padding: 0,
});
