import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '30rem',
  width: '100%',
  padding: '1rem 0',
  marginBottom: '1rem',
  display: 'flex',
  gap: '1rem',
  flexDirection: 'column',
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '30rem',
  width: '100%',
});
