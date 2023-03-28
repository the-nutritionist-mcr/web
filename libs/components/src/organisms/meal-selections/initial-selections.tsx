import { Tab, TabBox } from '../../containers';
import TabButton from './tab-button';
import MealList from './meal-list';
import { totalOtherSelected } from './total-other-selected';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlanWithMeals,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import CombinedBasket from './combined-basket';
import { updateAllSelectedMeals } from './update-all-selected';
import {
  chooseDayHeader,
  daySelectorButtonBox,
  daySelectorRow,
  gridParent,
  guidanceText,
  planTabRow,
  tabGrid,
} from './initial-selections.css';
import { getCookStatus } from '@tnmw/meal-planning';
import { useState } from 'react';
import { getDeliveryLabel } from './get-delivery-label';

export type SelectedMeals = { [key: string]: number }[][];

export interface InitialSelectionsProps {
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  setSelectedMeals: (newPlan: MealPlanGeneratedForIndividualCustomer) => void;
  currentTabIndex: number;
  onChangeIndex: (index: number) => void;
  recipes: Recipe[];
  cooks: PlannedCook[];
  customer: BackendCustomer;
}

const getActivePlan = (plans: PlanWithMeals[], customerPlan: StandardPlan) => {
  return plans.find(
    (plan) => plan.status === 'active' && plan.planId === customerPlan.id
  );
};

export const InitialSelections = (props: InitialSelectionsProps) => {
  const [currentCook, setCurrentCook] = useState(0);
  const [currentPlan, setCurrentPlan] = useState(0);
  return (
    <div>
      <h2 className={chooseDayHeader}>Delivery Day</h2>
      <div className={gridParent}>
        <TabBox
          tabButton={TabButton}
          currentTabIndex={currentCook}
          rowContainerClass={daySelectorRow}
          buttonBoxClass={daySelectorButtonBox}
          onChangeIndex={(which) => setCurrentCook(which)}
        >
          {props.cooks.flatMap((cook, dayIndex) => {
            const plans = props.customer.plans.filter(
              (plan) => getCookStatus(cook.date, plan).status === 'active'
            );

            return (
              <Tab
                tabTitle={getDeliveryLabel(props.customer, dayIndex)}
                key={`${cook.date.toString()}-${dayIndex}-tab`}
              >
                <p className={guidanceText}>
                  Happy with what you see here? You don't need to do anything!
                </p>
                <TabBox
                  tabButton={TabButton}
                  rowContainerClass={planTabRow}
                  currentTabIndex={currentPlan}
                  onChangeIndex={(which) => setCurrentPlan(which)}
                >
                  {plans.flatMap((category) => {
                    const delivery =
                      props.currentSelection.deliveries[dayIndex];

                    if (delivery.paused) {
                      return [];
                    }
                    const chosenSelection = getActivePlan(
                      delivery.plans,
                      category
                    );

                    if (!chosenSelection) {
                      return [];
                    }

                    return chosenSelection.status === 'active' &&
                      !chosenSelection.isExtra ? (
                      <Tab
                        tabTitle={category.name}
                        key={`${category.id}-${dayIndex}-tab`}
                      >
                        <div className={tabGrid}>
                          <MealList
                            customer={props.customer}
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

                          <CombinedBasket
                            customer={props.customer}
                            cooks={props.cooks}
                            currentSelection={props.currentSelection}
                            setSelectedMeals={props.setSelectedMeals}
                            recipes={props.recipes}
                          />
                        </div>
                      </Tab>
                    ) : (
                      []
                    );
                  })}
                </TabBox>
              </Tab>
            );
          })}
        </TabBox>
      </div>
    </div>
  );
};
