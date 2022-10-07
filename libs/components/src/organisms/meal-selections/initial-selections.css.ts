import { globalStyle, style } from '@vanilla-extract/css';

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
  borderRadius: '50px',
  margin: '4px',
  textDecoration: 'none',
});

export const daySelectorButtonBox = style({
  border: '1px solid black',
  borderRadius: '50px',
  display: 'flex',
});

export const header = style({
  fontSize: '2rem',
  marginBottom: '2rem',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
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
  fontFamily: "'Accumin Pro', Arial, sans-serif",
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
});

globalStyle(`${planTabRow} button`, {
  margin: 0,
  paddingBottom: 0,
  textDecoration: 0,
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
});
