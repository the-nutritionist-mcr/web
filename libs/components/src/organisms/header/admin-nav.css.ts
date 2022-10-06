import { style } from '@vanilla-extract/css';

export const headerListItem = style({
  listStyle: 'none',
  margin: 0,
  whiteSpace: 'nowrap',
  fontWeight: 300,
});

export const adminNavLink = style({
  textDecoration: 'none',
  color: 'black',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const headerUnorderedList = style({
  display: 'flex',
  width: '100%',
  fontSize: '22px',
  height: '32px',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  justifyContent: 'center',
  gap: '1rem',
  margin: 0,
  alignItems: 'center',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'none',
    },
  },
});
