import { BackendCustomer } from '@tnmw/types';

export const getDeliveryLabel = (
  customer: BackendCustomer,
  dayIndex: number
) => {
  const days = [customer.deliveryDay1, customer.deliveryDay2];

  return days[dayIndex] === 'None' ? '' : days[dayIndex];
};
