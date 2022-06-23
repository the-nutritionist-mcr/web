import { style } from '@vanilla-extract/css';

export const siteNavbarDesktop = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontWeight: 700,
  height: '88px',
  padding: '0 30px',
  borderBottom: '1px solid black',
  position: 'fixed',
  top: 0,
  width: '100%',
  backgroundColor: 'white',
  transition: 'ease transform 0.3s !important',
});

export const siteNavbarMobile = style({
  display: 'flex',
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  fontWeight: 700,
  height: '88px',
  padding: '0 30px',
  borderBottom: '1px solid black',
  position: 'fixed',
  top: 0,
  width: '100%',
  backgroundColor: 'white',
  transition: 'ease transform 0.3s !important',
});
