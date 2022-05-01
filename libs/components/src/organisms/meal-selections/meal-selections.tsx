import { FC, useState } from 'react';
import { TabBox, Tab } from '../../containers';
import MealList from './meal-list';
import TabButton from './tab-button';
import styled from '@emotion/styled';
import { Meal } from './meal';
import { defaultDeliveryDays } from '@tnmw/config';
import { MealCategory } from './meal-category';
import CombinedBasket from './combined-basket';
import { totalOtherSelected } from './total-other-selected';
import { setSelected } from './set-selected';
import { Button } from '@tnmw/components';

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
            return defaultDeliveryDays.map((_, dayIndex) => {
              return (
                <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.title}`}>
                  <MealList
                    things={category.options[dayIndex]}
                    selected={selectedMeals[categoryIndex][dayIndex]}
                    setSelected={(selected) => {
                      setSelected(
                        selected,
                        selectedMeals,
                        categoryIndex,
                        dayIndex,
                        setSelectedMeals
                      );
                    }}
                    max={
                      category.maxMeals -
                      totalOtherSelected(selectedMeals, categoryIndex, dayIndex)
                    }
                  />
                  <ButtonBox>
                    <Button size="large" primary color="callToAction">
                      Continue
                    </Button>
                    <Button size="large">Go Back</Button>
                  </ButtonBox>
                </Tab>
              );
            });
          })}
        </TabBox>
        <CombinedBasket
          availableMeals={props.availableMeals}
          selectedMeals={selectedMeals}
          setSelectedMeals={setSelectedMeals}
        />
      </GridParent>
    </DivContainer>
  );
};

export default MealSelections;
