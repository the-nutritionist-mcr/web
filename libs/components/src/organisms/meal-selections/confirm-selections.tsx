import {
  confirmSelectionsContainer,
  confirmSelectionsGrid,
  confirmSelectionsImage,
  countHeader,
  divider,
  summaryHeader,
} from './confirm-selections-container.css';
import { defaultDeliveryDays } from '@tnmw/config';
import { ConfirmDelivery } from './confirm-delivery';
import { countMeals } from './count-meals';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlanWithMeals,
  Recipe,
  StandardPlan,
  WeeklyCookPlanWithoutCustomerPlans,
} from '@tnmw/types';

interface ConfirmSelectionsProps {
  selectedMeals: MealPlanGeneratedForIndividualCustomer;
  customer: BackendCustomer;
  recipes: Recipe[];
  complete: boolean;
}

const getActivePlan = (plans: PlanWithMeals[], customerPlan: StandardPlan) => {
  return plans.find(
    (plan) => plan.status === 'active' && plan.planId === customerPlan.id
  );
};

export const ConfirmSelections = (props: ConfirmSelectionsProps) => {
  const totals = countMeals(props.selectedMeals);

  console.log(totals);

  const extrasString = totals.extras > 0 ? ` and ${totals.extras} extras` : ``;

  const totalsString = `${totals.meals} meals${extrasString} selected`;

  return (
    <div className={confirmSelectionsGrid}>
      <div className={confirmSelectionsContainer}>
        <h3 className={summaryHeader}>Your Selections</h3>
        <hr className={divider} />
        <h2 className={countHeader}>{totalsString}</h2>
        {defaultDeliveryDays.map((_, index) => {
          const sections = props.selectedMeals.customer.plans.flatMap(
            (category) => {
              const chosenSelection = getActivePlan(
                props.selectedMeals.deliveries[index].plans,
                category
              );

              if (chosenSelection?.status !== 'active') {
                return [];
              }
              return {
                name: category.name,
                meals: chosenSelection,
              };
            }
          );

          return (
            <ConfirmDelivery
              customer={props.customer}
              recipes={props.recipes}
              deliveryNumber={index + 1}
              sections={sections}
            />
          );
        })}
      </div>
      <div className={confirmSelectionsImage}></div>
    </div>
  );
};
