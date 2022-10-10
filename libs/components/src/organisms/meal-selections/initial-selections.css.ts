import { globalStyle, style } from '@vanilla-extract/css';

export const guidanceText = style({
  fontFamily: "ibm-plex-serif, 'Times New Roman', serif",
  lineHeight: '23px',
  paddingBottom: '0.5rem',
});

export const container = style({
  marginTop: '4rem',
  fontWeight: 'normal',
});

export const daySelectorRow = style({
  marginBottom: '2rem',
});

globalStyle(`${daySelectorRow} button.active`, {
  backgroundColor: '#176d67',
  color: '#D4F9E3',
});

globalStyle(`${daySelectorRow} button`, {
  lineHeight: '17px',
  whiteSpace: 'nowrap',
  borderRadius: '50px',
  margin: '4px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '0.7rem 0.5rem calc(0.7rem + 2px) 0.5rem',
});

export const daySelectorButtonBox = style({
  border: '1px solid black',
  borderRadius: '50px',
  display: 'flex',
});

export const header = style({
  fontSize: '2rem',
  marginBottom: '2rem',
  fontFamily: 'acumin-pro, Arial, sans-serif',
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'center',

  '@media': {
    'screen and (max-width: 899px)': {
      flexDirection: 'column',
    },
  },
});

export const chooseDayHeader = style({
  fontSize: '2rem',
  marginBottom: '2rem',
  marginTop: '4rem',
  fontFamily: 'acumin-pro, Arial, sans-serif',
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'center',

  '@media': {
    'screen and (max-width: 899px)': {
      flexDirection: 'column',
    },
  },
});

export const planTabRow = style({
  borderBottom: '1px solid black',
  marginTop: '2rem',
  whiteSpace: 'nowrap',
});

globalStyle(`${planTabRow} button`, {
  margin: 0,
  textDecoration: 0,
  borderBottom: 0,
  padding: 0,
});

globalStyle(`${planTabRow} button.active`, {
  borderBottom: '4px solid #176D67',
  textDecoration: 'none',
});

export const headerText = style({});

export const headerButtons = style({
  display: 'flex',
  gap: '1rem',
});

export const youNeedToChoose = style({
  color: '#3b7d7a',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
});

export const gridParent = style({
  width: '100vw',

  '@media': {
    'screen and (max-width: 899px)': {
      display: 'block',
    },
  },
});

export const tabGrid = style({
  display: 'grid',
  gridTemplateColumns: '70% 30%',
  maxWidth: '1460px',
  '@media': {
    'screen and (max-width: 899px)': {
      display: 'block',
      padding: '1rem',
    },
  },
});
