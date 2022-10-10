import { style } from '@vanilla-extract/css';

export const divider = style({
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e\")",
  width: '100%',
  height: '1px',
  border: '0',
  margin: '0',
});

export const nutritionAndAllergyLink = style({
  fontFamily: 'ibm-plex-mono, serif',
  fontSize: '0.7rem',
  margin: '0.5rem 0 1rem',
  alignSelf: 'start',
});

export const container = style({
  display: 'grid',
  textAlign: 'center',
  gridTemplateRows: '1fr 1fr 10px 0.8fr 3.25rem',
  height: '100%',
  maxWidth: '20rem',
  '@media': {
    'screen and (max-width: 899px)': {
      maxWidth: '100%',
    },
  },
});

export const description = style({
  fontFamily: "ibm-plex-serif, 'Times New Roman', serif",
  lineHeight: '23px',
  paddingBottom: '0.5rem',
});

export const header = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  fontSize: '1.7rem',
  alignSelf: 'center',
  textTransform: 'capitalize',
});
