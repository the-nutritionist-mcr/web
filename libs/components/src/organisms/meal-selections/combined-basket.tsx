import Basket from './basket';
import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { totalOtherSelected } from './total-other-selected';
import {
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlanWithMeals,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import { updateAllSelectedMeals } from './update-all-selected';
import { basketHeader, selectedBox, divider } from './combined-basket.css';

interface BasketProps {
  cooks: PlannedCook[];
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  setSelectedMeals: (newPlan: MealPlanGeneratedForIndividualCustomer) => void;
  recipes: Recipe[];
}

const getActivePlan = (plans: PlanWithMeals[], customerPlan: StandardPlan) => {
  return plans.find(
    (plan) => plan.status === 'active' && plan.planId === customerPlan.id
  );
};

const CombinedBasket = ({
  setSelectedMeals,
  recipes,
  currentSelection,
}: BasketProps) => {
  return (
    <div className={selectedBox}>
      <h2 className={basketHeader}>YOUR SELECTIONS</h2>
      <hr className={divider} />
      {currentSelection.customer.plans.flatMap((standardPlan) => {
        return defaultDeliveryDays.flatMap((_, dayIndex) => {
          const chosenSelection = getActivePlan(
            currentSelection.deliveries[dayIndex].plans,
            standardPlan
          );

          if (chosenSelection?.status !== 'active' || chosenSelection.isExtra) {
            return [];
          }

          return (
            <Basket
              key={`${standardPlan.id}-${dayIndex}-basket`}
              plan={standardPlan}
              itemWord="meal"
              customer={currentSelection.customer}
              title={`${standardPlan.name} - Delivery ${dayIndex + 1}`}
              itemWordPlural="meals"
              things={recipes}
              setSelected={(selected) => {
                updateAllSelectedMeals(
                  selected,
                  currentSelection,
                  setSelectedMeals,
                  dayIndex
                );
              }}
              selected={chosenSelection}
              max={
                standardPlan.totalMeals -
                totalOtherSelected(
                  currentSelection,
                  chosenSelection,
                  standardPlan
                )
              }
            />
          );
        });
      })}
    </div>
  );
};

export default CombinedBasket;
