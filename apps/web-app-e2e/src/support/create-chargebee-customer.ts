import { chargebee } from './chargebee/request';

export interface Customer {
  username: string;
  country: string;
  deliveryDay1: string;
  deliveryDay2: string;
  deliveryDay3: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  addressLine3: string;
  firstName: string;
  surname: string;
  email: string;
  city: string;
  postcode: string;
}

export const createChargebeeCustomer = async (customer: Customer) => {
  console.log(`Creating customer with username ${customer.username}`);

  await chargebee.customer
    .create({
      id: customer.username,
      first_name: customer.firstName,
      last_name: customer.surname,
      phone: customer.phoneNumber,
      email: customer.email,
      locale: 'en-GB',
      billing_address: {
        first_name: customer.firstName,
        last_name: customer.surname,
        line1: customer.addressLine1,
        line2: customer.addressLine2,
        city: customer.city,
        zip: customer.postcode,
        country: customer.country,
      },
    })
    .request();

  console.log('Customer created');

  return null;
};
