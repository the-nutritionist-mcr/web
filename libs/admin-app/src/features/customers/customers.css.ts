import { style } from '@vanilla-extract/css';

export const customerRow = style({
  selectors: {
    '&:hover': {
      outline: '1px solid #7D4CDB',
    },
  },
});

export const noPlan = style({
  color: '#ECECEC',
});

export const planTagActive = style({
  color: 'green',
});

export const planTagFuture = style({
  color: 'teal',
});

export const planTagPaused = style({
  color: 'blue',
});

export const planTagCancelled = style({
  color: 'red',
});

export const planTagNonRenewing = style({
  color: 'orange',
});
