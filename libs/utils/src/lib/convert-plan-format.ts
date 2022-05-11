import {
  CustomerPlan,
  StandardPlan,
  CustomerPlanWithoutConfiguration,
  PlanLabels,
  DaysPerWeek,
  PlanConfiguration,
} from '@tnmw/types';

import { makeNewPlan } from '@tnmw/meal-planning';

import { defaultDeliveryDays, extrasLabels, planLabels } from '@tnmw/config';

export const convertPlanFormat = (
  plans: StandardPlan[]
): CustomerPlanWithoutConfiguration =>
  plans
    .map((plan) =>
      makeNewPlan(
        {
          defaultDeliveryDays,
          planLabels: [...planLabels],
          extrasLabels: [...extrasLabels],
        },
        {
          planType: plan.name as PlanLabels,
          daysPerWeek: plan.daysPerWeek as DaysPerWeek,
          mealsPerDay: plan.itemsPerDay,
        }
      )
    )
    .reduce<Omit<CustomerPlan, 'configuration'>>(
      (accum, item) => ({
        deliveries: accum.deliveries.map((delivery, index) => ({
          // eslint-disable-next-line security/detect-object-injection
          items: delivery.items.concat(item.deliveries[index].items),
          extras: [],
        })),
        configuration: {} as PlanConfiguration,
      }),
      {
        deliveries: Array.from({ length: defaultDeliveryDays.length }).map(
          () => ({
            items: [],
            extras: [],
          })
        ),
      }
    );
