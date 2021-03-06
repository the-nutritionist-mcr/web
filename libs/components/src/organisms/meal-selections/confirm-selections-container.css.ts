import { style } from '@vanilla-extract/css';
import image from './_1011261.png';

console.log(image);

export const confirmSelectionsContainer = style({
  border: '1px solid black',
  padding: '1rem',
  height: '719px',
  overflow: 'scroll',
});

export const confirmSelectionsImage = style({
  border: '1px solid black',
  background: `url(${image})`,
});

export const confirmSelectionsGrid = style({
  gridTemplateColumns: 'repeat(2, 1fr)',
  display: 'grid',
  width: '100%',
  columnGap: '3rem',
  marginTop: '2rem',
});

export const container = style({
  marginTop: '3rem',
  width: '100%',
});

export const header = style({
  fontSize: '2rem',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  marginBottom: '2rem',
});

export const summaryHeader = style({
  textTransform: 'uppercase',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
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
