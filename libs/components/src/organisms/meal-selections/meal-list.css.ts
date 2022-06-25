import { style } from '@vanilla-extract/css';

export const mealListGrid = style({
  paddingTop: '2rem',
  gridTemplateColumns: 'repeat(3, 1fr)',
  display: 'grid',
  gap: '2rem',
});
