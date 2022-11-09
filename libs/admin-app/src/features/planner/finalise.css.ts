import { style } from '@vanilla-extract/css';

export const plannerInfoUl = style({
  margin: '1rem 0 3rem',
});

export const cell = style({
  padding: '0',
  margin: 0,
});

export const plannerInfoLi = style({
  listStyle: 'none',
});

export const plannerWarningLi = style({
  listStyle: 'none',
  color: 'red',
});

export const plannerIndentedUl = style({
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
});

export const plannerIndentedLi = style({
  marginLeft: '2rem',
  marginBottom: '0.3rem',
});
