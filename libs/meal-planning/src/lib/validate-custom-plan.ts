import { itemFamilies } from '@tnmw/config';
import { BackendCustomer, Delivery } from '@tnmw/types';
import deepEqual from 'deep-equal';
import { convertPlanFormat } from './convert-plan-format';

const countDeliveryItems = (deliveries: Delivery[]) =>
  Object.fromEntries(
    Object.entries(
      deliveries.reduce<Record<string, number>>((accum, item) => {
        item.items.forEach(
          (individualItem) =>
            (accum[individualItem.name] =
              individualItem.name in accum
                ? accum[individualItem.name] + individualItem.quantity
                : individualItem.quantity)
        );
        return accum;
      }, {})
    ).filter(([, value]) => value > 0)
  );

export const validateCustomPlan = (customer: BackendCustomer): boolean => {
  if (!customer.customPlan) {
    return true;
  }

  const converted = convertPlanFormat(customer.plans, itemFamilies);

  const countsFromCustomPlans = countDeliveryItems(customer.customPlan);
  const countsFromPlans = countDeliveryItems(converted.deliveries);

  if (deepEqual(countsFromCustomPlans, countsFromPlans)) {
    return true;
  }

  return false;
};
