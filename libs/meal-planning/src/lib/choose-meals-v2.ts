import { defaultDeliveryDays, extrasLabels, planLabels } from '@tnmw/config';
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

const selectPlanMealsForDelivery = (
  cook: Cook,
  plan: StandardPlan,
  distribution: Delivery
): PlanWithMeals => {
  const statusResult = getCookStatus(cook.date, plan);

  if (statusResult.status !== 'active') {
    return statusResult;
  }

  const meals = distribution.items.flatMap((item) =>
    Array.from({ length: item.quantity }).map(() => ({
      name: item.name,
      isExtra: plan.isExtra,
    }))
  );

  return {
    ...statusResult,
    meals: meals.map((item, index) =>
      plan.isExtra
        ? { isExtra: true, extraName: item.name }
        : {
            isExtra: false,
            chosenVariant: item.name,
            recipe: cook.menu[index % cook.menu.length],
          }
    ),
  };
};

const generateCustomerDeliveryFromCook = (
  cook: Cook & { index: number },
  customer: BackendCustomer
): PlannedDelivery => {
  return {
    plans: customer.plans.map((plan) => {
      const distribution = getDistribution(plan, customer.customPlan)[
        cook.index
      ];
      return selectPlanMealsForDelivery(cook, plan, distribution);
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

export const chooseMeals = (
  deliverySelection: Cook[],
  customers: BackendCustomer[],
  createdBy: string
): WeeklyCookPlan => {
  const cooks = deliverySelection.map((cook, index) => ({ ...cook, index }));
  return {
    customerPlans: customers.map((customer) =>
      generateCustomerDeliveries(cooks, customer)
    ),

    cooks: cooks.map((cook) => ({ date: cook.date, menu: cook.menu })),
    createdBy,
    createdOn: new Date(),
  };
};
