import { style } from '@vanilla-extract/css';

export const confirmSelectionsContainer = style({
  border: '1px solid black',
  padding: '1rem',
});

export const confirmSelectionsImage = style({
  border: '1px solid black',
});

export const confirmSelectionsGrid = style({
  gridTemplateColumns: 'repeat(2, 1fr)',
  display: 'grid',
  width: '100%',
});

export const summaryHeader = style({
  textTransform: 'uppercase',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontSize: '1.7rem',
  fontWeight: 'bold',
  margin: '1rem 0 0 0',
  padding: '0',
});

export const countHeader = style({
  textTransform: 'capitalize',
});

export const divider = style({
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e\")",
  width: '100%',
  height: '1px',
  margin: '0 0 0.5rem 0',
  border: '0',
});
