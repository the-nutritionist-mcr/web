import { FC, Dispatch, SetStateAction } from 'react';
import { SelectedThings } from './selected-things';
import Basket from './basket';
import styled from '@emotion/styled';
import { MealCategory } from './meal-category';
import { defaultDeliveryDays } from '@tnmw/config';
import { totalOtherSelected } from './total-other-selected';
import { setSelected } from './set-selected';
import { SelectedMeals } from './initial-selections';

interface BasketProps {
  availableMeals: MealCategory[];
  selectedMeals: (SelectedThings | undefined)[][];
  setSelectedMeals: (selected: SelectedMeals) => void;
  categoriesThatAreNotExtrasIndexes: number[];
}

const SelectedBox = styled.div`
  margin: 1rem;
  padding: 1rem;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 25rem;
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

const CombinedBasket: FC<BasketProps> = ({
  availableMeals,
  selectedMeals,
  setSelectedMeals,
  categoriesThatAreNotExtrasIndexes,
}) => {
  return (
    <SelectedBox>
      <BasketHeader>YOUR SELECTIONS</BasketHeader>
      <Divider />
      {availableMeals.flatMap((category, categoryIndex) => {
        return defaultDeliveryDays.map((_, dayIndex) => {
          return !categoriesThatAreNotExtrasIndexes.includes(
            categoryIndex
          ) ? null : (
            <Basket
              itemWord="meal"
              title={`${category.title} - Delivery ${dayIndex + 1}`}
              itemWordPlural="meals"
              available={availableMeals[categoryIndex].options[dayIndex]}
              setSelected={(selected) =>
                setSelected(
                  selected,
                  selectedMeals,
                  categoryIndex,
                  dayIndex,
                  setSelectedMeals
                )
              }
              selectedMeals={selectedMeals[categoryIndex][dayIndex]}
              max={
                category.maxMeals -
                totalOtherSelected(selectedMeals, categoryIndex, dayIndex)
              }
            />
          );
        });
      })}
    </SelectedBox>
  );
};

export default CombinedBasket;
