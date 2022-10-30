import {
  BackendCustomer,
  ChangePlanRecipeBody,
  MealPlanGeneratedForIndividualCustomer,
  MealSelectionPayload,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { calendarFormat } from '@tnmw/config';
import { Paragraph } from 'grommet';
import moment from 'moment';
import React from 'react';
import FinalizeCustomerTable from './FinalizeCustomerTable';
import { plannerInfoLi, plannerInfoUl, plannerWarningLi } from './finalise.css';

interface FinalizeProps {
  customerMeals: MealPlanGeneratedForIndividualCustomer[];
  recipes: Recipe[];
  cooks: PlannedCook[];
  published: boolean;
  generatedBy: string;
  customers: BackendCustomer[];
  creationDate: Date;
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
}

const Finalize: React.FC<FinalizeProps> = ({
  customerMeals,
  recipes,
  cooks,
  update,
  creationDate,
  generatedBy,
  published,
  customers,
}) => {
  const wrongNumber = customerMeals.length !== customers.length;
  if (!customerMeals) {
    return (
      <Paragraph fill>
        You&apos;ve not yet selected any meals to be included in the plan yet.
        You can do this by going to the recipes page and clicking the
        &apos;Planning Mode&apos; button.
      </Paragraph>
    );
  }
  return (
    <>
      <ul className={plannerInfoUl}>
        <li className={plannerInfoLi}>
          Plan generated on{' '}
          <strong>{moment(creationDate).calendar(null, calendarFormat)}</strong>{' '}
          by <strong>{generatedBy}</strong>
        </li>
        <li className={plannerInfoLi}>
          This plan <strong>{published ? 'has' : 'has not'}</strong> been
          published to customers
        </li>
        {wrongNumber && (
          <li className={plannerWarningLi}>
            The planner has generated the wrong number of rows. This is probably
            a bug - please let Ben know that you&apos;ve seen this message
          </li>
        )}
      </ul>
      {
        // eslint-disable-next-line fp/no-mutating-methods
        customerMeals
          .slice()
          .sort((a, b) =>
            a.customer.surname.toLowerCase() > b.customer.surname.toLowerCase()
              ? 1
              : // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                -1
          )
          .filter((customerPlan) => customerPlan.customer.plans.length > 0)
          .map((customerPlan) => (
            <FinalizeCustomerTable
              key={`${customerPlan.customer.username}-finalize-table`}
              customerSelection={customerPlan}
              deliveryMeals={cooks}
              allRecipes={recipes}
              columns={5}
              update={update}
            />
          ))
      }
    </>
  );
};

export default Finalize;
