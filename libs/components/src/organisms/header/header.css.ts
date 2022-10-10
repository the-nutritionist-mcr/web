import { style } from '@vanilla-extract/css';

export const mainMenuContainer = style({
  maxWidth: '1460px',
  width: '100%',
  margin: '0 auto',
  display: 'block',
  padding: '0 30px',
  listStyle: 'none',
  boxSizing: 'border-box',
});

export const headerUnorderedList = style({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  margin: '0',
  '@media': {
    'screen and (min-width: 900px)': {
      justifyContent: 'space-between',
    },
  },
});

export const headerUnorderedListMobile = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  margin: '0',
});

export const accountWrapper = style({
  listStyle: 'none',
  height: 40,
  width: 40,
  margin: 0,
  flexGrow: 2,
});

export const accountButton = style({
  width: '92.3203px',
  fontFamily: 'acumin-pro,sans-serif',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `50%`,
  display: 'block',
  whiteSpace: 'nowrap',
  height: '38px',
  textAlign: 'center',
  margin: 0,
  lineHeight: '21px',
  fontSize: '21px',
  padding: 0,
  '@media': {
    'screen and (max-width: 900px)': {
      height: 40,
      width: 40,
      flexGrow: 2,
      textAlign: 'left',
    },
  },
});

export const headerHidden = style({
  transform: 'translateY(-100%)',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'fixed',
  fontSize: '21px',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 19,
  width: '100vw',
  transition: 'ease transform 0.3s !important',
});

export const customerHeader = style({
  borderBottom: '1px solid #0d0d0d',
  height: '88px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  background: 'white',
});

export const headerMobile = style({
  height: '88px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  background: 'white',
  padding: '0 30px',
  fontSize: '21px',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderBottom: '1px solid #0d0d0d',
});

export const siteNavbarDesktop = style({
  display: 'flex',
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1460px',
  position: 'relative',
});

export const siteNavbarMobile = style({
  display: 'flex',
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
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
