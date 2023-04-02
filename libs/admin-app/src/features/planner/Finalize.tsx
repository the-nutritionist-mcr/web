import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedCook,
  Recipe,
} from '@tnmw/types';
import { FaInfo } from 'react-icons/fa';
import { calendarFormat } from '@tnmw/config';
import { Card, Paragraph } from 'grommet';
import moment from 'moment';
import React from 'react';
import FinalizeCustomerTable from './FinalizeCustomerTable';
import {
  icon,
  plannerIndentedLi,
  plannerIndentedUl,
  plannerInfoLi,
  plannerWarningLi,
} from './finalise.css';
import { getCookStatus } from '@tnmw/meal-planning';

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
  const customerUsernames = new Set(
    customerMeals.map((meal) => meal.customer.username)
  );
  const missingCustomers = customers
    .filter((customer) => !customerUsernames.has(customer.username))
    .filter((customer) =>
      customer.plans.some((plan) =>
        cooks.some(
          (cook) => getCookStatus(cook.date, plan).status !== 'cancelled'
        )
      )
    );

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
      <Card pad="medium">
        <ul>
          <li className={plannerInfoLi}>
            <FaInfo size="25px" className={icon} />
            <span>
              Plan generated{' '}
              <strong>
                {moment(creationDate).calendar(null, calendarFormat)}
              </strong>{' '}
              by <strong>{generatedBy}</strong>
            </span>
          </li>
          <li className={plannerInfoLi}>
            <FaInfo size="25px" className={icon} />
            <span>
              This plan <strong>{published ? 'has' : 'has not'}</strong> been
              published to customers
            </span>
          </li>

          {missingCustomers.length > 0 && (
            <li className={plannerWarningLi}>
              The planner is missing an entry for the following customer(s):{' '}
              <ul className={plannerIndentedUl}>
                {missingCustomers.map((customer) => (
                  <li className={plannerIndentedLi}>
                    {customer.firstName} {customer.surname}
                  </li>
                ))}
              </ul>
              If customer(s) were added <strong>after</strong> the current plan
              was generated, this is normal behaviour and you can ignore this
              message. If not, please get in touch with Ben.
            </li>
          )}
        </ul>
      </Card>
      {
        // eslint-disable-next-line fp/no-mutating-methods
        customerMeals
          .slice()
          .sort((a, b) => {
            if ((a?.sortingPriority ?? 0) > (b?.sortingPriority ?? 0)) {
              return -1;
            }

            if ((b?.sortingPriority ?? 0) > (a?.sortingPriority ?? 0)) {
              return 1;
            }
            if (
              a.customer.surname.toLowerCase() >
              b.customer.surname.toLowerCase()
            ) {
              return 1;
            }
            return -1;
          })
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
