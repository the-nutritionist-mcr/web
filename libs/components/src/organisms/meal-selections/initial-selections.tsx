import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Tab, TabBox } from '../../containers';
import TabButton from './tab-button';
import MealList from './meal-list';
import { totalOtherSelected } from './total-other-selected';
import {
  ActivePlanWithMeals,
  BackendCustomer,
  Customer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlanWithMeals,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import CombinedBasket from './combined-basket';
import { updateAllSelectedMeals } from './update-all-selected';

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

const getActivePlan = (plans: PlanWithMeals[], customerPlan: StandardPlan) => {
  return plans.find(
    (plan) => plan.status === 'active' && plan.planId === customerPlan.id
  );
};

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
            return defaultDeliveryDays.flatMap((_, dayIndex) => {
              const chosenSelection = getActivePlan(
                props.currentSelection.deliveries[dayIndex].plans,
                category
              );

              if (!chosenSelection) {
                return [];
              }

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
                      updateAllSelectedMeals(
                        selected,
                        props.currentSelection,
                        props.setSelectedMeals,
                        dayIndex
                      );
                    }}
                    max={
                      category.totalMeals -
                      totalOtherSelected(
                        props.currentSelection,
                        chosenSelection,
                        category
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
      <CombinedBasket
        cooks={props.cooks}
        currentSelection={props.currentSelection}
        setSelectedMeals={props.setSelectedMeals}
        recipes={props.recipes}
      />
    </GridParent>
  );
};
