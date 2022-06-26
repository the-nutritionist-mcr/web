import { globalStyle, style } from '@vanilla-extract/css';

export const table = style({});

globalStyle(`.${table} td, .${table} th`, {
  verticalAlign: 'middle',
});
