import { globalKeyframes, globalStyle, style } from '@vanilla-extract/css';

export const dualRingLoader = style({
  display: 'inline-block',
});

globalStyle(`.${dualRingLoader}:after`, {
  content: ' ',
  display: 'inline-block',
  width: '32px',
  height: '32px',
  margin: '8px',
  borderRadius: '50%',
  border: '6px solid #fff',
  borderColor: 'red transparent red transparent',
  animation: `${dualRingLoader} 1.2s linear infinite`,
});

globalKeyframes(dualRingLoader, {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});
