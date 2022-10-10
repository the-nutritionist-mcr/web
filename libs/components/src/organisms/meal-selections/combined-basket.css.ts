import { style } from '@vanilla-extract/css';

export const deliveryNameHeader = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  width: '100%',
  backgroundColor: '#d4f9e3',
  padding: '0.3rem 0.5rem',
  margin: '1rem 0',
});

export const listBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginBottom: '2rem',
});

export const selectedBox = style({
  margin: '2.5rem 1rem',
  padding: '1rem',
  border: '1px solid black',
  maxWidth: '25rem',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'none',
    },
  },
});

export const basketHeader = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  fontSize: '1.7rem',
  fontWeight: 'bold',
  margin: 0,
  padding: 0,
});
