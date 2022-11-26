import { BackendCustomer, SubscriptionStatus } from '@tnmw/types';
import { Tag, Box } from 'grommet';
import { itemFamilies } from '@tnmw/config';

import {
  planTagActive,
  planTagCancelled,
  planTagFuture,
  planTagPaused,
} from './customers.css';
import { noPlan } from './customisations-cell.css';

type StatusClasses = { [K in SubscriptionStatus]: string };

interface PlanCellProps {
  customer: BackendCustomer;
}

export const PlanCell = (props: PlanCellProps) => {
  const statusClass: StatusClasses = {
    active: planTagActive,
    future: planTagFuture,
    in_trial: '',
    non_renewing: planTagActive,
    paused: planTagPaused,
    cancelled: planTagCancelled,
  };

  if (props.customer.plans.length === 0) {
    return <span className={noPlan}>None</span>;
  }

  return (
    <Box direction="row" gap="xsmall">
      {
        // eslint-disable-next-line fp/no-mutating-methods
        props.customer.plans
          .filter(
            (plan) =>
              plan.subscriptionStatus !== 'cancelled' &&
              plan.subscriptionStatus !== 'in_trial'
          )
          .slice()
          .sort((a, b) =>
            a.subscriptionStatus === 'active' &&
            b.subscriptionStatus !== 'active'
              ? -1
              : 1
          )
          .map((plan) => {
            const colorClass = statusClass[plan.subscriptionStatus] ?? '';
            return (
              <div
                className={colorClass}
                key={`${props.customer.username}-plan-pill-${plan.name}-${plan.id}`}
              >
                <Tag
                  size="xsmall"
                  value={`${
                    itemFamilies.find((family) => plan.name === family.name)
                      ?.shortName
                  }-${plan.totalMeals}`}
                />
              </div>
            );
          })
      }
    </Box>
  );
};
