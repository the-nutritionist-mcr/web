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

export const iconTag = style({
  width: '40px',
  height: '40px',
});

export const closeButton = style({
  border: 0,
  background: 0,
  top: '30px',
  right: '30px',
  position: 'absolute',
  cursor: 'pointer',
});

export const mobileMenuContainer = style({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#F3b762',
  position: 'fixed',
  padding: '30px',
  zIndex: 10_000,
  width: '100vw',
  height: '100vh',
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
  fontFamily: 'acumin-pro-semi-condensed',
  textDecoration: 'none',
  color: 'black',
});
