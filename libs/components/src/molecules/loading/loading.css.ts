import { style } from '@vanilla-extract/css';

export const hide = style({
  visibility: 'hidden',
});

export const loader = style({
  width: '100%',
  paddingTop: 'calc(88px + 2rem + 32px)',
  height: '100%',
  justifyContent: 'center',
});
