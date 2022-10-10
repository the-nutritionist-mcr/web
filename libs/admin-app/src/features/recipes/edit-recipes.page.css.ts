import { style } from '@vanilla-extract/css';

export const editRecipePage = style({
  maxWidth: '1460px',
});

export const formGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(97vw, 30rem), 1fr))',
  gap: '1rem',
  alignItems: 'end',
});

export const details = style({
  marginBottom: '3rem',
});

export const alternatesGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
  gap: '1rem',
  alignItems: 'end',
});
