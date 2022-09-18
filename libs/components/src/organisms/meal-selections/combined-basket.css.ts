import { style } from '@vanilla-extract/css';

export const selectedBox = style({
  margin: '1rem',
  padding: '1rem',
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: '25rem',
});

export const basketHeader = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif'",
  fontSize: '1.7rem',
  fontWeight: 'bold',
  margin: 0,
  padding: 0,
});

export const divider = style({
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e\");",
  width: '100%',
  height: '1px',
  margin: '0 0 0.5rem 0',
  border: '0',
});
