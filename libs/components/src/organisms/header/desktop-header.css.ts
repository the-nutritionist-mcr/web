import TnmHeader from './TNM-Header.svg';

import { style } from '@vanilla-extract/css';

export const headerUnorderedList = style({
  display: 'flex',
  width: '100%',
  fontSize: '21px',
  justifyContent: 'space-between',
  margin: '0 auto',
  height: '100%',
  alignItems: 'center',
  transition: 'ease transform 0.3s !important',
  maxWidth: '1460px',
  padding: '0 30px',
});

export const theNutritionistLogo = style({
  background: `url(${TnmHeader})`,
  width: '313px',
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
  textDecoration: 'none',
  color: '#292929',
});
