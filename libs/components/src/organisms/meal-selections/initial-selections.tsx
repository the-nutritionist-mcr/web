import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Tab, TabBox } from '../../containers';
import CombinedBasket from './combined-basket';
import TabButton from './tab-button';
import MealList from './meal-list';
import { setSelected } from './set-selected';
import { totalOtherSelected } from './total-other-selected';
import {
  BackendCustomer,
  Customer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';

const GridParent = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 70% 30%;
`;

export type SelectedMeals = { [key: string]: number }[][];

export interface InitialSelectionsProps {
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  setSelectedMeals: (newPlan: MealPlanGeneratedForIndividualCustomer) => void;
  currentTabIndex: number;
  onChangeIndex: (index: number) => void;
  recipes: Recipe[];
  cooks: PlannedCook[];
}

export const InitialSelections = (props: InitialSelectionsProps) => {
  return (
    <GridParent>
      <TabBox
        tabButton={TabButton}
        currentTabIndex={props.currentTabIndex}
        onChangeIndex={props.onChangeIndex}
      >
        {props.currentSelection.customer.plans.flatMap(
          (category, planIndex) => {
            return defaultDeliveryDays.map((_, dayIndex) => {
              const chosenSelection =
                props.currentSelection.deliveries[dayIndex].plans[planIndex];

              return chosenSelection.status === 'active' &&
                !chosenSelection.isExtra ? (
                <Tab tabTitle={`Delivery ${dayIndex + 1} ${category.name}`}>
                  <MealList
                    customer={props.currentSelection.customer}
                    recipes={props.recipes}
                    things={props.cooks[dayIndex].menu}
                    selected={chosenSelection}
                    plan={category}
                    setSelected={(selected) => {
                      props.setSelectedMeals({
                        ...props.currentSelection,
                        deliveries: props.currentSelection.deliveries.map(
                          (delivery, dIndex) => {
                            return dIndex !== dayIndex
                              ? delivery
                              : {
                                  ...delivery,
                                  plans: delivery.plans.map((plan, pIndex) =>
                                    pIndex !== planIndex ? plan : selected
                                  ),
                                };
                          }
                        ),
                      });
                    }}
                    max={
                      category.totalMeals -
                      totalOtherSelected(
                        props.currentSelection,
                        planIndex,
                        dayIndex
                      )
                    }
                  />
                </Tab>
              ) : (
                []
              );
            });
          }
        )}
      </TabBox>
      {/*
      <CombinedBasket
        availableMeals={props.availableMeals}
        customer={props.customer}
        recipes={props.recipes}
        selectedMeals={props.selectedMeals}
        setSelectedMeals={props.setSelectedMeals}
        categoriesThatAreNotExtrasIndexes={
          props.categoriesThatAreNotExtrasIndexes
        }
      />
      */}
    </GridParent>
  );
};
