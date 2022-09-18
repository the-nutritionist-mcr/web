import { style } from '@vanilla-extract/css';

export const mealListGrid = style({
  paddingTop: '2rem',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridAutoRows: 'minmax(min-content, max-content)',
  display: 'grid',
  gap: '2rem',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
});
