import { BackendCustomer, SwappedMealPlan } from '@tnmw/types';

const titleCase = (string: string) =>
  string
    .toLocaleLowerCase()
    .split(' ')
    .map((word) => `${word.slice(0, 1).toLocaleUpperCase()}${word.slice(1)}`)
    .join(' ');

const generateNormalisedAddress = ({
  addressLine1,
  addressLine2,
  addressLine3,
  postcode,
}: BackendCustomer) =>
  [
    titleCase(addressLine1),
    titleCase(addressLine2),
    titleCase(addressLine3),
    postcode.toLocaleUpperCase(),
  ]
    .filter(Boolean)
    .map((line) => line.replace(/(^[\W(]+|[\W(]+$)/gm, ''))
    .join(', ');

const makeLabelObject = (customer: BackendCustomer) => {
  return {
    name: `${customer.firstName} ${customer.surname}`,
    address: generateNormalisedAddress(customer),
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
  const allCustomerMap = new Map<string, BackendCustomer>();

  customers.forEach((customer) =>
    allCustomerMap.set(customer.username, customer)
  );

  selections.forEach((selections) => {
    const customer = allCustomerMap.get(selections.customer.username);
    if (customer) {
      customerMap.set(selections.customer.username, customer);
    }
  });

  customers.forEach((customer) => {
    if (customerMap.has(customer.username)) {
      customerMap.set(customer.username, customer);
    }
  });

  const includeCustomers = new Set<string>();
  // eslint-disable-next-line fp/no-mutating-methods
  selections.forEach((selection) => {
    const delivery = selection.deliveries[deliveryNumber];
    if (delivery.paused) {
      return;
    }
    delivery.plans.forEach((plan) => {
      if (plan.status === 'active' && plan.meals.length > 0) {
        includeCustomers.add(selection.customer.username);
      }
    });
  });

  // eslint-disable-next-line fp/no-mutating-methods
  return Array.from(includeCustomers)
    .map((username) => customerMap.get(username))
    .flatMap((customer) =>
      customer
        ? Array.from({ length: customer.numberOfBags ?? 1 }).map(() => customer)
        : []
    )
    .slice()
    .sort((a, b) => (a.surname > b.surname ? 1 : -1))
    .map((customer) => makeLabelObject(customer));
};
