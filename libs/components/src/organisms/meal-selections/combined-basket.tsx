import { FC, Dispatch, SetStateAction } from 'react';
import { Meal } from './meal';
import { SelectedThings } from './selected-things';
import Basket from './basket';
import styled from '@emotion/styled';
import { MealCategory } from './meal-category';

interface BasketProps {
  availableMeals: MealCategory[];
  available: Meal[];
  selectedMeals: SelectedThings[][];
  setMeals: Dispatch<SetStateAction<SelectedThings[][]>>;
}

const SelectedBox = styled.div`
  padding: 1rem;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BasketHeader = styled.h2`
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-size: 1.7rem;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const Divider = styled.hr`
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  width: 100%;
  height: 1px;
  margin: 0 0 0.5rem 0;
  border: 0;
`;

const CombinedBasket: FC<BasketProps> = (props) => {
  return (
    <SelectedBox>
      <BasketHeader>YOUR SELECTIONS</BasketHeader>
      <Divider />
      <Basket
        max={props.maxMeals}
        itemWord="meal"
        itemWordPlural="meals"
        selectedMeals={props.selectedMeals}
        available={props.available}
        setSelected={props.setMeals}
      />

      <Basket
        max={props.maxSnacks}
        itemWord="snack"
        itemWordPlural="snacks"
        selectedMeals={props.selectedSnacks}
        available={props.available}
        setSelected={props.setSnacks}
      />
      <Basket
        max={props.maxBreakfasts}
        itemWord="breakfast"
        itemWordPlural="breakfasts"
        selectedMeals={props.selectedBreakfasts}
        available={props.available}
        setSelected={props.setBreakfasts}
      />
    </SelectedBox>
  );
};

export default CombinedBasket;
