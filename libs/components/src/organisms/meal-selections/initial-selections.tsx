import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Tab, TabBox } from '../../containers';
import CombinedBasket from './combined-basket';
import TabButton from './tab-button';
import { MealCategory } from './meal-category';
import MealList from './meal-list';
import { setSelected } from './set-selected';
import { totalOtherSelected } from './total-other-selected';
import { container, header, youNeedToChoose } from './initial-selections.css';

const GridParent = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 70% 30%;
`;

export type SelectedMeals = { [key: string]: number }[][];

export interface InitialSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
  selectedMeals: SelectedMeals;
  setSelectedMeals: (selected: SelectedMeals) => void;
  currentTabIndex: number;
  onChangeIndex: (index: number) => void;
}

export const InitialSelections = (props: InitialSelectionsProps) => {
  return (
    <div className={container}>
      <h2 className={header}>Choose Your Meals</h2>
      <p className={youNeedToChoose}>You need to choose 12 meals</p>
      <GridParent>
        <TabBox
          tabButton={TabButton}
          currentTabIndex={props.currentTabIndex}
          onChangeIndex={props.onChangeIndex}
        >
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
    </div>
  );
};
