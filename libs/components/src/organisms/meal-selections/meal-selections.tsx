import { FC, useState } from 'react';
import { TabBox, Tab } from '../../containers';
import MealList from './meal-list';
import TabButton from './tab-button';
import styled from '@emotion/styled';
import { Meal } from './meal';
import { defaultDeliveryDays } from '@tnmw/config';
import { MealCategory } from './meal-category';

export interface MealSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
}

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

const createDefaultSelectedThings = (things: Meal[][]) =>
  things.map((day) => Object.fromEntries(day.map((thing) => [thing.id, 0])));

const MealSelections: FC<MealSelectionsProps> = (props) => {
  const [selectedMeals, setSelectedMeals] = useState(
    props.availableMeals.map((meals) =>
      createDefaultSelectedThings(meals.options)
    )
  );

  return (
    <DivContainer>
      <GridParent>
        <TabBox tabButton={TabButton}>
          {props.availableMeals.flatMap((category, categoryIndex) => {
            return defaultDeliveryDays.map((day, dayIndex) => {
              const totalOtherSelected = selectedMeals[categoryIndex]
                .filter((day, index) => dayIndex !== index)
                .reduce((accum, entry) => {
                  return (
                    Object.entries(entry).reduce((pairAccum, pairEntry) => {
                      return pairEntry[1] + pairAccum;
                    }, 0) + accum
                  );
                }, 0);
              return (
                <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.title}`}>
                  <MealList
                    things={category.options[dayIndex]}
                    selected={selectedMeals[categoryIndex][dayIndex]}
                    setSelected={(selected) => {
                      const newSelectedMeals = [
                        ...selectedMeals[categoryIndex],
                      ];
                      newSelectedMeals[dayIndex] = selected;
                      const finalSelected = [...selectedMeals];
                      finalSelected[categoryIndex] = newSelectedMeals;
                      setSelectedMeals(finalSelected);
                    }}
                    max={category.maxMeals - totalOtherSelected}
                  />
                </Tab>
              );
            });
          })}
        </TabBox>
      </GridParent>
    </DivContainer>
  );
};

export default MealSelections;
