import { BackendCustomer, SwappedMealPlan } from '@tnmw/types';

const makeLabelObject = (customer: BackendCustomer) => {
  return {
    name: `${customer.firstName} ${customer.surname}`,
    address: `${customer.addressLine1} ${customer.addressLine2} ${customer.addressLine3} ${customer.postcode}`,
    phone: customer.phoneNumber,
    email: customer.email,
    notes: customer.deliveryNotes,
  };
};
export const generateAddressDownload = (
  selections: SwappedMealPlan[],
  customers: BackendCustomer[],
  deliveryNumber: number
) => {
  const customerMap = new Map<string, BackendCustomer>();
  customers.forEach((customer) => customerMap.set(customer.username, customer));
  const includeCustomers = new Set<string>();
  // eslint-disable-next-line fp/no-mutating-methods
  selections.forEach((selection) => {
    const delivery = selection.deliveries[deliveryNumber];
    delivery.plans.forEach((plan) => {
      if (plan.status === 'active' && plan.meals.length > 0) {
        includeCustomers.add(selection.customer.username);
      }
    });
  });

  return Array.from(includeCustomers)
    .map((username) => customerMap.get(username))
    .flatMap((customer) => (customer ? [customer] : []))
    .map((customer) => makeLabelObject(customer));
};
