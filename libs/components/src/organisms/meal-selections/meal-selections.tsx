import { FC, useState } from 'react';
import { TabBox, Tab } from '../../containers';
import MealList from './meal-list';
import TabButton from './tab-button';
import styled from '@emotion/styled';
import { Meal } from './meal';
import CombinedBasket from './combined-basket';

export interface MealSelectionsProps {
  mealsAvailable: Meal[];
  breakfastsAvailable: Meal[];
  snacksAvailable: Meal[];
  maxMeals: number;
  maxSnacks: number;
  maxBreakfasts: number;
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

const createDefaultSelectedThings = (things: Meal[]) =>
  Object.fromEntries(things.map((thing) => [thing.id, 0]));

const MealSelections: FC<MealSelectionsProps> = (props) => {
  const [selectedMeals, setSelectedMeals] = useState(
    createDefaultSelectedThings(props.mealsAvailable)
  );

  const [selectedBreakfasts, setSelectedBreakfasts] = useState(
    createDefaultSelectedThings(props.breakfastsAvailable)
  );

  const [selectedSnacks, setSelectedSnacks] = useState(
    createDefaultSelectedThings(props.snacksAvailable)
  );

  return (
    <DivContainer>
      <GridParent>
        <TabBox tabButton={TabButton}>
          <Tab tabTitle="Meals">
            <MealList
              things={props.mealsAvailable}
              selected={selectedMeals}
              setSelected={setSelectedMeals}
              max={props.maxMeals}
            />
          </Tab>

          <Tab tabTitle="Breakfasts">
            <MealList
              things={props.breakfastsAvailable}
              selected={selectedBreakfasts}
              setSelected={setSelectedBreakfasts}
              max={props.maxBreakfasts}
            />
          </Tab>
          <Tab tabTitle="Snacks">
            <MealList
              things={props.snacksAvailable}
              selected={selectedSnacks}
              setSelected={setSelectedSnacks}
              max={props.maxSnacks}
            />
          </Tab>
        </TabBox>
        <CombinedBasket
          available={[
            ...props.mealsAvailable,
            ...props.snacksAvailable,
            ...props.breakfastsAvailable,
          ]}
          selectedMeals={selectedMeals}
          setMeals={setSelectedMeals}
          selectedSnacks={selectedSnacks}
          setSnacks={setSelectedSnacks}
          selectedBreakfasts={selectedBreakfasts}
          setBreakfasts={setSelectedBreakfasts}
          maxMeals={props.maxMeals}
          maxSnacks={props.maxSnacks}
          maxBreakfasts={props.maxBreakfasts}
        />
      </GridParent>
    </DivContainer>
  );
};

export default MealSelections;
