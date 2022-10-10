import { style } from '@vanilla-extract/css';

export const header = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
});

export const deliveryContainer = style({
  marginBottom: '2rem',
});

export const deliveryNumberHeader = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  width: '100%',
  backgroundColor: '#d4f9e3',
  padding: '0.3rem 0.5rem',
});

export const sectionContainer = style({
  marginLeft: '0.5rem',
});

export const noMealsLi = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  listStyle: 'none',
  color: 'red',
  fontStyle: 'italic',
});

export const mealSelectionLi = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  listStyle: 'none',
  display: 'flex',
  alignItems: 'baseline',
});

export const itemCount = style({
  borderRadius: '50%',
  border: '1px solid black',
  marginRight: '0.5rem',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const itemCountNumber = style({
  paddingTop: '0.25rem',
});

export const mealTitle = style({
  textTransform: 'capitalize',
});

export const sectionHeader = style({
  fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
  margin: '1rem 0',
  padding: 0,
});
