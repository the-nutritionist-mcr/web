import { style } from '@vanilla-extract/css';

export const profileLink = style({});

export const planGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 20rem))',
  width: `100%`,
  gap: '1rem',
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
