import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Tab, TabBox } from '../../containers';
import TabButton from './tab-button';
import MealList from './meal-list';
import { totalOtherSelected } from './total-other-selected';
import {
  BackendCustomer,
  Customer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlanWithMeals,
  Recipe,
  StandardPlan,
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
                      props.setSelectedMeals({
                        ...props.currentSelection,
                        deliveries: props.currentSelection.deliveries.map(
                          (delivery, dIndex) => {
                            return dIndex !== dayIndex
                              ? delivery
                              : {
                                  ...delivery,
                                  plans: delivery.plans.map((plan) =>
                                    plan.id === selected.id ? selected : plan
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
