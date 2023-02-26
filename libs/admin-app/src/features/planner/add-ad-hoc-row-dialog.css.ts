import { style } from '@vanilla-extract/css';

export const editGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
});
