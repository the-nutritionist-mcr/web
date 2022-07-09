import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE, ENV, E2E } from '@tnmw/constants';

export const createChargebeeCustomer = async () => {
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];
  console.log('Creating chargebee customer');
  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });

  await new Promise((accept, reject) => {
    chargebee.customer
      .create({
        id: E2E.nonExistingUser.username,
        first_name: 'John',
        last_name: 'Doe',
        email: E2E.nonExistingUser.email,
        locale: 'fr-CA',
        billing_address: {
          first_name: 'John',
          last_name: 'Doe',
          line1: 'PO Box 9999',
          city: 'Walnut',
          state: 'California',
          zip: '91789',
          country: 'US',
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
