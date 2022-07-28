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
});

export const headerText = style({
  flexGrow: '2',
});

export const youNeedToChoose = style({
  color: '#3b7d7a',
  fontFamily: "'Accumin Pro', Arial, sans-serif",
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
});
