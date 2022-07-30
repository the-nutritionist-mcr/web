import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Tab, TabBox } from '../../containers';
import CombinedBasket from './combined-basket';
import TabButton from './tab-button';
import { MealCategory } from './meal-category';
import MealList from './meal-list';
import { setSelected } from './set-selected';
import { totalOtherSelected } from './total-other-selected';
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
  const showIndexes = props.availableMeals.reduce<number[]>(
    (accum, category, index) => (category.isExtra ? accum : [...accum, index]),
    []
  );

  const selectedMeals = props.selectedMeals.filter((meal, index) =>
    showIndexes.includes(index)
  );

  return (
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
              const selected = selectedMeals[categoryIndex][dayIndex];
              return (
                <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.title}`}>
                  {selected ? (
                    <MealList
                      things={category.options[dayIndex]}
                      selected={selected}
                      setSelected={(selected) => {
                        setSelected(
                          selected,
                          selectedMeals,
                          categoryIndex,
                          dayIndex,
                          props.setSelectedMeals
                        );
                      }}
                      max={
                        category.maxMeals -
                        totalOtherSelected(
                          selectedMeals,
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
  );
};
