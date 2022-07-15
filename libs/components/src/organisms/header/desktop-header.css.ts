import TnmHeader from './TNM-Header.svg';
import Account from './account.svg';

import { style } from '@vanilla-extract/css';

export const headerUnorderedList = style({
  display: 'flex',
  width: '100%',
  margin: '0',
  justifyContent: 'space-between',
});

export const accountButton = style({
  background: `url(${Account})`,
  width: '92.3203px',
  fontFamily: '"Acumin Pro",sans-serif',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `50%`,
  display: 'block',
  textIndent: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  height: '38px',
});

export const getStartedButton = style({
  outline: 'none',
  borderRadius: '25px',
  textAlign: 'center',
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
  lineHeight: 'normal',
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

export const theNutritionistALink = style({
  maxWidth: '35px',
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
  fontFamily: '"Acumin Pro",sans-serif',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: '#141414',
});
