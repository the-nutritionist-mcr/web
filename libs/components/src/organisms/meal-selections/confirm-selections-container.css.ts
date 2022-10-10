import { style } from '@vanilla-extract/css';

export const confirmSelectionsContainer = style({
  border: '1px solid black',
  padding: '1rem',
  height: '800px',
  overflow: 'scroll',
  '@media': {
    'screen and (max-width: 899px)': {
      height: 'auto',
    },
  },
});

export const imgTags = style({
  width: '100%',
});

export const confirmSelectionsImage = style({
  border: '1px solid black',
  height: '800px',
  overflow: 'hidden',

  '@media': {
    'screen and (max-width: 899px)': {
      width: '100%',
      height: '400px',
    },
  },
});

export const confirmSelectionsGrid = style({
  gridTemplateColumns: 'repeat(2, 1fr)',
  display: 'grid',
  columnGap: '3rem',
  marginTop: '2rem',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      margin: '1rem',
    },
  },
});

export const container = style({
  marginTop: '3rem',
  width: '100%',
});

export const header = style({
  fontSize: '2rem',
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  marginBottom: '2rem',
});

export const summaryHeader = style({
  textTransform: 'uppercase',
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  fontSize: '1.7rem',
  margin: '1rem 0 0 0',
  padding: '0',
});

export const goAheadAndSubmit = style({
  color: '#3b7d7a',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
});

export const countHeader = style({
  textTransform: 'capitalize',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
  fontSize: '1.2rem',
  color: '#3b7d7a',
  marginBottom: '1rem',
});

export const divider = style({
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e\")",
  width: '100%',
  height: '1px',
  margin: '1rem 0 2rem 0',
  border: '0',
});
