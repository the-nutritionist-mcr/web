import { style } from '@vanilla-extract/css';

export const formGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
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
