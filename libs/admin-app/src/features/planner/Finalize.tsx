import {
  ChangePlanRecipeBody,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { calendarFormat } from '@tnmw/config';
import { Paragraph } from 'grommet';
import moment from 'moment';
import React from 'react';
import FinalizeCustomerTable from './FinalizeCustomerTable';
import { plannerInfoLi, plannerInfoUl } from './finalise.css';

interface FinalizeProps {
  customerMeals: MealPlanGeneratedForIndividualCustomer[];
  recipes: Recipe[];
  cooks: PlannedCook[];
  published: boolean;
  generatedBy: string;
  creationDate: Date;
  update: (item: ChangePlanRecipeBody) => Promise<void>;
}

const Finalize: React.FC<FinalizeProps> = ({
  customerMeals,
  recipes,
  cooks,
  update,
  creationDate,
  generatedBy,
  published,
}) => {
  const planned = cooks.map((cook) => cook.menu);

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
              key={`${customerPlan.customer.id}-finalize-table`}
              customerSelection={customerPlan}
              deliveryMeals={planned}
              allRecipes={recipes}
              columns={6}
              update={update}
            />
          ))
      }
    </>
  );
};

export default Finalize;
