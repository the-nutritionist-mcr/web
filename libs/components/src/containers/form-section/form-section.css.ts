import { style } from '@vanilla-extract/css';

export const gridContainer = style({
  display: 'grid',
  gridTemplateColumns: '15rem 15rem',
  gridColumnGap: '1rem',
  gridRowGap: '1rem',
  marginBottom: '2.2rem',
  paddingTop: '2.2rem',
});

export const sectionContents = style({
  borderTop: '1px dashed #b8b8b8',
  width: '100%',
  display: 'flex',
});

export const iconContainer = style({
  display: 'flex',
  gap: '1rem',
  paddingTop: '3.9rem',
  paddingLeft: '10rem',
});

export const header = style({
  fontFamily: "'Accumin Pro', Arial, sans-serif",
});
