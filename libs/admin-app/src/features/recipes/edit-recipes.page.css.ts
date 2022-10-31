import { style } from '@vanilla-extract/css';

export const editRecipePage = style({
  maxWidth: '1460px',
  width: '100vw',
  margin: 'auto 0',
  padding: '2rem',
});

export const formGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 20rem)',
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
