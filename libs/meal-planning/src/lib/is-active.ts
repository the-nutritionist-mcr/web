import { CustomerWithChargebeePlan } from '@tnmw/types';

const isActive = (
  customer: CustomerWithChargebeePlan,
  date?: Date
): boolean => {
  const now = date ?? new Date(Date.now());

  if (customer.pauseEnd && now > new Date(customer.pauseEnd)) {
    return true;
  }

  if (customer.pauseStart && now < new Date(customer.pauseStart)) {
    return true;
  }

  if (
    customer.pauseStart &&
    now > new Date(customer.pauseStart) &&
    customer.pauseEnd &&
    now < new Date(customer.pauseEnd)
  ) {
    return false;
  }

  if (
    !customer.pauseStart &&
    customer.pauseEnd &&
    now < new Date(customer.pauseEnd)
  ) {
    return false;
  }

  if (
    customer.pauseStart &&
    now > new Date(customer.pauseStart) &&
    !customer.pauseEnd
  ) {
    return false;
  }

  return true;
};

export default isActive;
