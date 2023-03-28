import TnmHeader from './TNM-Header.svg';

import tnmNLogo from './tnm-n-logo.svg';
import { style } from '@vanilla-extract/css';
import menuSvg from './menu.svg';

export const getStartedButton = style({
  outline: 'none',
  borderRadius: '25px',
  textAlign: 'center',
  fontFamily: 'acumin-pro,sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 700,
  background: '#292929',
  color: '#fff',
  padding: '10px 30px',
  fontSize: '16px',
  border: '1px solid #000',
  margin: 0,
  lineHeight: 1,
  '@media': {
    'screen and (max-width: 900px)': {
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
    },
  },
});

export const mobileLogoLi = style({
  position: 'absolute',
  left: 0,
  right: 0,
  margin: '0 auto',
  width: '60px',
  background: `url(${tnmNLogo})`,
  height: '60px',
  listStyle: 'none',
});

export const menuButton = style({
  border: 0,
  background: 0,
  width: '40px',
  height: '40px',
  cursor: 'pointer',
});

export const hideOnDesktop = style({
  '@media': {
    'screen and (min-width: 901px)': {
      display: 'none',
    },
  },
});

export const hideOnMobile = style({
  '@media': {
    'screen and (max-width: 900px)': {
      display: 'none',
    },
  },
});

export const menuButtonContainer = style({
  background: `url(${menuSvg})`,
  height: '40px',
  width: '50px',
  margin: '0',
  backgroundRepeat: 'no-repeat',
  display: 'block',
});

export const theNutritionistLogo = style({
  backgroundImage: `url(${TnmHeader})`,
  backgroundRepeat: 'no-repeat',
  width: '315px',
  height: '34px',
  display: 'block',
  margin: 0,
  padding: 0,
  textIndent: '100%',
  backgroundSize: 'contain',
  backgroundPosition: 'center center',
});

export const mobileLogoNA = style({
  textIndent: '100%',
  overflow: 'hidden',
  display: 'block',
});

export const theNutritionistALink = style({
  width: '100%',
  height: '34px',
  display: 'block',
  textIndent: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const headerListItem = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  listStyle: 'none',
  margin: 0,
  whiteSpace: 'nowrap',
});

export const menuAnchor = style({
  fontFamily: 'acumin-pro,sans-serif',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: '#141414',
});
