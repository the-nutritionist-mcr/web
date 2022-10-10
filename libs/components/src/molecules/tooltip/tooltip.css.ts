import { globalStyle, style } from '@vanilla-extract/css';

export const hiddenTooltip = style({
  display: 'none',
});

export const tooltipText = style({
  visibility: 'hidden',
  position: 'absolute',
  top: '8rem',
  lineHeight: '1.4rem',
  left: '50%',
  width: '20rem',
  border: '1px solid black',
  background: 'white',
  padding: '1.3rem',
  zIndex: '1',
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  '@media': {
    'screen and (max-width: 899px)': {
      left: 'unset',
      right: '-10px',
      top: '5rem',

      selectors: {
        '&::before': {
          left: 'unset',
          right: '25px',
        },

        '&::after': {
          left: 'unset',
          right: '26px',
        },
      },
    },
  },
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: '-20px',
      left: '60px',
      borderWidth: '0 20px 20px',
      borderStyle: 'solid',
      borderColor: 'black transparent',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      top: '-19px',
      left: '61px',
      borderWidth: '0 19px 19px',
      borderStyle: 'solid',
      borderColor: 'white transparent',
    },
  },
});

export const tooltipContainer = style({
  position: 'relative',
});

globalStyle(`${tooltipContainer}:hover ${tooltipText}`, {
  visibility: 'visible',
});
