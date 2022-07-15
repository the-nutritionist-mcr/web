import { style } from '@vanilla-extract/css';

export const mainMenuContainer = style({
  maxWidth: '1460px',
  width: '100%',
  margin: '0 auto',
  display: 'block',
  padding: '0 30px',
  boxSizing: 'border-box',
});

export const header = style({
  height: '88px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  background: 'white',
  fontSize: '21px',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderBottom: '1px solid #0d0d0d',
});

export const siteNavbarDesktop = style({
  display: 'flex',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1460px',
  position: 'relative',
});

export const siteNavbarMobile = style({
  display: 'flex',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontWeight: 700,
  height: '88px',
  padding: '0 30px',
  borderBottom: '1px solid black',
  position: 'fixed',
  alignItems: 'center',
  top: 0,
  width: '100%',
  backgroundColor: 'white',
  transition: 'ease transform 0.3s !important',
});
