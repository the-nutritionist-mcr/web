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
import { ParagraphText } from '../../atoms';

const GridParent = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 70% 30%;
`;

export type SelectedMeals = ({ [key: string]: number } | undefined)[][];

export interface InitialSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
  selectedMeals: SelectedMeals;
  setSelectedMeals: (selected: SelectedMeals) => void;
  currentTabIndex: number;
  remainingMeals: number;
  onChangeIndex: (index: number) => void;
}

export const InitialSelections = (props: InitialSelectionsProps) => {
  return (
    <div className={container}>
      <h2 className={header}>Choose Your Meals</h2>
      <p className={youNeedToChoose}>
        You need to choose {props.remainingMeals} meals
      </p>
      <GridParent>
        <TabBox
          tabButton={TabButton}
          currentTabIndex={props.currentTabIndex}
          onChangeIndex={props.onChangeIndex}
        >
          {props.availableMeals
            .filter((category) => !category.isExtra)
            .flatMap((category, categoryIndex) => {
              return defaultDeliveryDays.map((_, dayIndex) => {
                const selected = props.selectedMeals[categoryIndex][dayIndex];
                return (
                  <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.title}`}>
                    {selected ? (
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
                    ) : (
                      <ParagraphText>Currently Paused</ParagraphText>
                    )}
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
