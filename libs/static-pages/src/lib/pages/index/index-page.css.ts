import { style } from '@vanilla-extract/css';
import DishesMobile from '../../../styles/images/dishes-mb.png';
import Dishes from '../../../styles/images/dishes-dt.png';

export const pageHeaderImage = style({
  width: '100%',
});

export const dishesBlock = style({
  backgroundImage: `url(${Dishes})`,
  '@media': {
    'screen and (max-size: 599px)': {
      backgroundImage: `url(${DishesMobile})`,
    },
  },
});
