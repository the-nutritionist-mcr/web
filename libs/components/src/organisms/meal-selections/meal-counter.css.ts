import { style } from '@vanilla-extract/css';

export const divider = style({
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e\")",
  width: '100%',
  height: '1px',
  margin: '1rem 0 0.5rem 0',
  border: '0',
});

export const nutritionAndAllergyLink = style({
  fontFamily: "'IBM Plex Mono', serif",
  margin: '0.5rem 0 1rem',
});

export const header = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontSize: '1.7rem',
  margin: '0 0 1.5rem 0',
  display: 'block',
  height: '2rem',
  textTransform: 'capitalize',
});
