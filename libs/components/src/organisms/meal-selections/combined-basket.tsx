import Basket from './basket';
import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { totalOtherSelected } from './total-other-selected';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  PlanWithMeals,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import { updateAllSelectedMeals } from './update-all-selected';
import {
  basketHeader,
  selectedBox,
  deliveryNameHeader,
  listBox,
} from './combined-basket.css';
import { getDeliveryLabel } from './get-delivery-label';

interface BasketProps {
  cooks: PlannedCook[];
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  setSelectedMeals: (newPlan: MealPlanGeneratedForIndividualCustomer) => void;
  recipes: Recipe[];
  customer: BackendCustomer;
}

const Divider = styled.hr`
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='4%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  width: 100%;
  height: 1px;
  margin: 1rem 0 1.5rem 0;
  border: 0;
`;

const getActivePlan = (plans: PlanWithMeals[], customerPlan: StandardPlan) => {
  return plans.find(
    (plan) => plan.status === 'active' && plan.planId === customerPlan.id
  );
};

const CombinedBasket = ({
  setSelectedMeals,
  recipes,
  currentSelection,
  customer,
}: BasketProps) => {
  return (
    <div className={selectedBox}>
      <h2 className={basketHeader}>YOUR SELECTIONS</h2>
      <Divider />
      {defaultDeliveryDays.flatMap((_, dayIndex) => {
        return (
          <>
            <h3 className={deliveryNameHeader}>
              {getDeliveryLabel(currentSelection.customer, dayIndex)}
            </h3>
            <div className={listBox}>
              {currentSelection.customer.plans.flatMap((standardPlan) => {
                const delivery = currentSelection.deliveries[dayIndex];

                if (delivery.paused) {
                  return [];
                }
                const chosenSelection = getActivePlan(
                  delivery.plans,
                  standardPlan
                );

                if (
                  chosenSelection?.status !== 'active' ||
                  chosenSelection.isExtra
                ) {
                  return [];
                }

                return (
                  <Basket
                    key={`${standardPlan.id}-${dayIndex}-basket`}
                    plan={standardPlan}
                    itemWord="meal"
                    customer={customer}
                    title={standardPlan.name}
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
              })}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default CombinedBasket;
