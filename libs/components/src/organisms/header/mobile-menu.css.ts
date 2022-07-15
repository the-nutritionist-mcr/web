import { style } from '@vanilla-extract/css';

export const mobileMenuItem = style({
  listStyle: 'none',
  borderBottom: '1px solid black',
  selectors: {
    '&:last-child': {
      borderBottom: '0',
    },
  },
});

export const mobileMenuUl = style({
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const mobileMenuAnchor = style({
  fontSize: '37px',
  padding: '15px 0',
  width: '100%',
  display: 'block',
  fontFamily: '"Acumin Pro Semicondensed"',
  textDecoration: 'none',
  color: 'black',
});
