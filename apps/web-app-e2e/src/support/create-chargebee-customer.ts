import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE, ENV, E2E } from '@tnmw/constants';

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
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];
  console.log(`Creating customer ${JSON.stringify(customer, null, 2)}`);
  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });

  await new Promise((accept, reject) => {
    chargebee.customer
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
          city: customer.city,
          zip: customer.postcode,
          country: 'GB',
        },
      })
      .request(function (error, result) {
        if (error) {
          reject(error);
        } else {
          accept(result);
        }
      });
  });

  console.log('Customer created');

  return null;
};
