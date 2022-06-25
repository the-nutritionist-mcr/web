import { style } from '@vanilla-extract/css';

export const header = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
});

export const deliveryNumberHeader = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  width: '100%',
  backgroundColor: '#d4f9e3',
  padding: '0.3rem 0.5rem',
});

export const sectionContainer = style({
  marginLeft: '0.5rem',
});

export const noMealsLi = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  listStyle: 'none',
  color: 'red',
  fontStyle: 'italic',
});

export const mealSelectionLi = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  listStyle: 'none',
  display: 'flex',
  alignItems: 'flex-end',
});

export const itemCount = style({
  borderRadius: '50%',
  border: '1px solid black',
  marginRight: '0.5rem',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
});

export const mealTitle = style({
  textTransform: 'capitalize',
});

export const sectionHeader = style({
  fontFamily: "'Acumin Pro', Arial, sans-serif",
  margin: '1rem 0',
});
