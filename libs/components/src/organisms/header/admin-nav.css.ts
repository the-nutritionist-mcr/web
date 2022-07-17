import { style } from '@vanilla-extract/css';

export const headerListItem = style({
  listStyle: 'none',
  margin: 0,
  whiteSpace: 'nowrap',
  fontWeight: 300,
});

export const headerUnorderedList = style({
  display: 'flex',
  width: '100%',
  fontSize: '16px',
  justifyContent: 'center',
  gap: '1rem',
  margin: 0,
  alignItems: 'center',
});
