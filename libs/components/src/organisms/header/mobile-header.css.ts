import { style } from '@vanilla-extract/css';

import Account from './account.svg';
import menuSvg from './menu.svg';

import tnmNLogo from './tnm-n-logo.svg';

export const menuButton = style({
  width: '40px',
  height: '40px',
  border: 0,
  background: 0,
});

export const menuButtonContainer = style({
  background: `url(${menuSvg})`,
  height: '40px',
  width: '50px',
  margin: '0',
  backgroundRepeat: 'no-repeat',
  display: 'block',
});

export const accountWrapper = style({
  listStyle: 'none',
  height: 40,
  width: 40,
  margin: 0,
  flexGrow: 2,
});

export const mobileLogoLi = style({
  position: 'absolute',
  left: 0,
  right: 0,
  margin: '0 auto',
  width: '60px',
  background: `url(${tnmNLogo})`,
  height: '60px',
  textIndent: '100%',
  listStyle: 'none',
  overflow: 'hidden',
});

export const gettingStartedWrapper = style({
  listStyle: 'none',
  margin: 0,
});

export const mobileHeaderGettingStartedButton = style({
  width: '75px',
  fontSize: '13px',
  padding: '10px 45px',
  whiteSpace: 'nowrap',
  fontWeight: 700,
  outline: 'none',
  listStyle: 'none',
  borderRadius: '25px',
  textAlign: 'center',
  fontFamily: 'acumin-pro,sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#292929',
  color: '#fff',
  border: '1px solid #000',
  margin: 0,
  lineHeight: 1,
});

export const accountButtonMobile = style({
  background: `url(${Account})`,
  flexGrow: 2,
  fontFamily: 'acumin-pro,sans-serif',
  backgroundRepeat: 'no-repeat',
  display: 'block',
  textIndent: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  height: '40px',
  margin: 0,
  lineHeight: '21px',
  fontSize: '21px',
  padding: 0,
  width: '40px',
});
