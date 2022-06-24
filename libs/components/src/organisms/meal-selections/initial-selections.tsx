import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { useState } from 'react';
import { Button } from '../../atoms';
import { Tab, TabBox } from '../../containers';
import CombinedBasket from './combined-basket';
import TabButton from './tab-button';
import { Meal } from './meal';
import { MealCategory } from './meal-category';
import MealList from './meal-list';
import { setSelected } from './set-selected';
import { totalOtherSelected } from './total-other-selected';

const GridParent = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 70% 30%;
`;

const DivContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 2rem;
`;

const ButtonBox = styled.div`
  width: 100%;
  gap: 1rem;
  display: grid;
  margin-top: 3rem;
  grid-template-columns: 4fr 2fr;
  & > * {
    grid-column-start: 2;
    grid-column-end: 2;
  }
`;

export type SelectedMeals = { [key: string]: number }[][];

export interface InitialSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
  selectedMeals: SelectedMeals;
  setSelectedMeals: (selected: SelectedMeals) => void;
  currentTabIndex: number;
}

export const InitialSelections = (props: InitialSelectionsProps) => {
  return (
    <GridParent>
      <TabBox tabButton={TabButton} currentTabIndex={props.currentTabIndex}>
        {props.availableMeals.flatMap((category, categoryIndex) => {
          return defaultDeliveryDays.map((_, dayIndex) => {
            return (
              <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.title}`}>
                <MealList
                  things={category.options[dayIndex]}
                  selected={props.selectedMeals[categoryIndex][dayIndex]}
                  setSelected={(selected) => {
                    setSelected(
                      selected,
                      props.selectedMeals,
                      categoryIndex,
                      dayIndex,
                      props.setSelectedMeals
                    );
                  }}
                  max={
                    category.maxMeals -
                    totalOtherSelected(
                      props.selectedMeals,
                      categoryIndex,
                      dayIndex
                    )
                  }
                />
              </Tab>
            );
          });
        })}
      </TabBox>
      <CombinedBasket
        availableMeals={props.availableMeals}
        selectedMeals={props.selectedMeals}
        setSelectedMeals={props.setSelectedMeals}
      />
    </GridParent>
  );
};
