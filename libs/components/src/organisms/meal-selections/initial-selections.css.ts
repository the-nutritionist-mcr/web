import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: '4rem',
  fontWeight: 'normal',
});

export const header = style({
  fontSize: '2rem',
  marginBottom: '2rem',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',

  '@media': {
    'screen and (max-width: 899px)': {
      flexDirection: 'column',
    },
  },
});

export const headerText = style({
  flexGrow: '2',
});

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
  display: 'grid',
  width: 'calc(100vw - 2rem)',
  maxWidth: '1460px',
  gridTemplateColumns: '70% 30%',

  '@media': {
    'screen and (max-width: 899px)': {
      display: 'block',
    },
  },
});
