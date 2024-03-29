import { ENV, CHARGEBEE_SITES } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { TEST_USER } from './constants';

import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

const chargebee = new ChargeBee();

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

const plugins = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // eslint-disable-next-line fp/no-mutating-methods
      launchOptions.args.push('--disable-dev-shm-usage');
    }
    return launchOptions;
  });

  on('task', {
    async createChargebeeCustomer(customer: Customer) {
      console.log(`Creating Chargebee Customer: ${customer.username}`);
      chargebee.configure({
        site: CHARGEBEE_SITES.test,
        api_key: process.env[`NX_${ENV.varNames.ChargeBeeToken}`],
      });

      await new Promise((accept, reject) => {
        chargebee.customer
          .create({
            id: customer.username,
            first_name: customer.firstName,
            last_name: customer.surname,
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

      return null;
    },

    async removeTestCustomer() {
      chargebee.configure({
        site: CHARGEBEE_SITES.test,
        api_key: process.env[`NX_${ENV.varNames.ChargeBeeToken}`],
      });

      await new Promise((accept, reject) => {
        chargebee.customer.delete(TEST_USER).request((error, result) => {
          if (error) {
            reject(error);
          } else {
            accept(result);
          }
        });
      });
      const cognito = new CognitoIdentityProviderClient({});

      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: process.env[`NX_${ENV.varNames.CognitoPoolId}`],
        Username: TEST_USER,
      });

      await cognito.send(deleteCommand);
    },
  });
  return config;
};

export default plugins;
