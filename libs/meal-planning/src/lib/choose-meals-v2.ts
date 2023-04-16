import { defaultDeliveryDays, extrasLabels, planLabels } from '@tnmw/config';
import { v4 } from 'uuid';
import {
  Recipe,
  BackendCustomer,
  WeeklyCookPlan,
  MealPlanGeneratedForIndividualCustomer,
  PlannedDelivery,
  StandardPlan,
  Delivery,
  PlanWithMeals,
  PlanLabels,
  DaysPerWeek,
} from '@tnmw/types';
import { generateDistribution } from './distribution-generator';
import { getCookStatus } from './get-cook-status';
import { itemFamilies } from '@tnmw/config';

export interface Cook {
  date: Date;
  menu: Recipe[];
}

const getDistribution = (
  plan: StandardPlan,
  customPlan?: Delivery[]
): Delivery[] => {
  if (customPlan && customPlan.length > 0) {
    return customPlan.map((delivery) => ({
      ...delivery,
      items: delivery.items.map((item) => ({
        ...item,
        quantity: plan.name === item.name ? item.quantity : 0,
      })),
    }));
  }
  return generateDistribution(
    {
      planType: plan.name as PlanLabels,
      daysPerWeek: plan.daysPerWeek as DaysPerWeek,
      mealsPerDay: plan.itemsPerDay,
      totalPlans: 1,
      deliveryDays: defaultDeliveryDays,
      extrasChosen: [],
    },
    {
      planLabels: [...planLabels],
      extrasLabels: [...extrasLabels],
      defaultDeliveryDays: defaultDeliveryDays,
    }
  );
};

const isExcluded = (recipe: Recipe, customer: BackendCustomer) => {
  return recipe.invalidExclusions?.some((invalidExclusion) =>
    customer.customisations
      .map((customerExclusion) => customerExclusion.id)
      .includes(invalidExclusion)
  );
};

const selectPlanMealsForDelivery = (
  cook: Cook,
  plan: StandardPlan,
  distribution: Delivery,
  customer: BackendCustomer,
  startIndex: number
): PlanWithMeals & { nextIndex: number } => {
  const statusResult = getCookStatus(cook.date, plan);

  if (statusResult.status !== 'active') {
    return {
      id: v4(),
      name: plan.name,
      nextIndex: startIndex,
      ...statusResult,
    };
  }

  const meals = distribution.items.flatMap((item) =>
    Array.from({ length: item.quantity }).map(() => ({
      name: item.name,
      isExtra: plan.isExtra,
    }))
  );

  const menuAfterExclusions = cook.menu.filter(
    (item) => !isExcluded(item, customer)
  );

  const nextIndex = plan.isExtra
    ? startIndex
    : meals.length % menuAfterExclusions.length;

  return {
    ...statusResult,
    nextIndex,
    name: plan.name,
    id: v4(),
    planId: plan.id,
    isExtra: plan.isExtra,
    meals: meals.map((item, index) =>
      plan.isExtra
        ? { isExtra: true, extraName: item.name }
        : {
            isExtra: false,
            chosenVariant: item.name,
            recipe:
              menuAfterExclusions[
                (index + startIndex) % menuAfterExclusions.length
              ],
          }
    ),
  };
};

const generateCustomerDeliveryFromCook = (
  cook: Cook & { index: number },
  customer: BackendCustomer
): PlannedDelivery => {
  // eslint-disable-next-line fp/no-let
  let lastIndex = 0;

  const notPaused = customer.plans
    .filter((plan) => plan.subscriptionStatus !== 'cancelled')
    .some((plan) => {
      const status = getCookStatus(cook.date, plan);

      return status.status !== 'paused';
    });

  const firstPaused = customer.plans.find((plan) => {
    const status = getCookStatus(cook.date, plan);

    return status.status === 'paused';
  });

  return !notPaused
    ? {
        paused: true,
        pausedFrom:
          firstPaused?.pauseStart !== undefined
            ? new Date(firstPaused?.pauseStart)
            : undefined,
        pausedUntil:
          firstPaused?.pauseEnd !== undefined
            ? new Date(firstPaused?.pauseEnd)
            : undefined,
      }
    : {
        paused: false,
        plans: customer.plans.map((plan) => {
          const distribution = getDistribution(plan, customer.customPlan)[
            cook.index
          ];
          const result = selectPlanMealsForDelivery(
            cook,
            plan,
            distribution,
            customer,
            lastIndex
          );

          lastIndex = result.nextIndex;

          return result;
        }),
        dateCooked: cook.date,
      };
};

const generateCustomerDeliveries = (
  deliverySelection: (Cook & { index: number })[],
  customer: BackendCustomer
): MealPlanGeneratedForIndividualCustomer => {
  return {
    deliveries: deliverySelection.map((cook) =>
      generateCustomerDeliveryFromCook(cook, customer)
    ),
    customer,
    wasUpdatedByCustomer: false,
  };
};

const isExtra = (name: string) =>
  Boolean(itemFamilies.find((family) => family.name === name)?.isExtra);

export const makeMissingStandardPlansFromCustomPlan = (
  customer: BackendCustomer
): StandardPlan[] => {
  const planNamesFromCustomPlans = new Set<string>(
    customer.customPlan?.flatMap((plan) =>
      plan.items.filter((item) => item.quantity > 0).map((item) => item.name)
    ) ?? []
  );

  const planNamesFromStandardPlans = new Set(
    customer.plans.map((plan) => plan.name)
  );

  const missing = Array.from(planNamesFromCustomPlans).filter(
    (name) => !planNamesFromStandardPlans.has(name)
  );

  return missing.map((name) => ({
    id: '0',
    name,
    daysPerWeek: 0,
    itemsPerDay: 0,
    isExtra: isExtra(name),
    totalMeals: 0,
    subscriptionStatus: 'active',
    termEnd: 0,
  }));
};

export const chooseMealSelections = (
  deliverySelection: Cook[],
  customers: BackendCustomer[],
  createdBy: string
): WeeklyCookPlan => {
  const cooks = deliverySelection.map((cook, index) => ({ ...cook, index }));
  return {
    customerPlans: customers.map((customer) => {
      const customerWithCustomPlansAdded = {
        ...customer,
        plans: [
          ...customer.plans,
          ...makeMissingStandardPlansFromCustomPlan(customer),
        ],
      };
      return generateCustomerDeliveries(cooks, customerWithCustomPlansAdded);
    }),

    cooks: cooks.map((cook) => ({ date: cook.date, menu: cook.menu })),
    createdBy,
    createdOn: new Date(),
  };
};
