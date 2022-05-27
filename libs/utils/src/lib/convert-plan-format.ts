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

interface Family {
  name: string;
  isExtra: boolean;
}

export const convertPlanFormat = (
  plans: StandardPlan[],
  itemFamilies: Family[]
): CustomerPlanWithoutConfiguration => {
  const convertedPlans = plans.map((plan) => {
    const newPlan = makeNewPlan(
      {
        defaultDeliveryDays,
        planLabels: itemFamilies?.map((item) => item.name as PlanLabels) ?? [
          ...planLabels,
        ],
        extrasLabels: [...extrasLabels],
      },
      {
        planType: plan.name as PlanLabels,
        daysPerWeek: plan.daysPerWeek as DaysPerWeek,
        mealsPerDay: plan.itemsPerDay,
      }
    );
    return {
      ...newPlan,
      deliveries: newPlan.deliveries.map((delivery) => ({
        ...delivery,
        items: delivery.items.map((item) => ({
          ...item,
          isExtra: itemFamilies?.find((family) => item.name === family.name)
            ?.isExtra,
        })),
      })),
    };
  });

  const combinedPlans = convertedPlans.reduce<
    Omit<CustomerPlan, 'configuration'>
  >(
    (accum, plan) => ({
      deliveries: plan.deliveries.map((delivery, index) => ({
        // eslint-disable-next-line security/detect-object-injection
        items: delivery.items.map((item) => {
          const thisItemInOtherPlan = accum.deliveries[index].items.find(
            (otherItem) => otherItem.name === item.name
          );

          return {
            ...item,
            quantity: item.quantity + (thisItemInOtherPlan?.quantity ?? 0),
            isExtra: thisItemInOtherPlan?.isExtra ?? item.isExtra,
          };
        }),
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

  return combinedPlans;
};
