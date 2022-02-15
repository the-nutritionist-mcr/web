import { ENV, CHARGEBEE_SITES, MAILSLURP_INBOX, E2E } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { TEST_USER } from './constants';
import MailSlurp from 'mailslurp-client';

import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

const chargebee = new ChargeBee();

const plugins = (on, config) => {
  on('task', {
    async createChargebeeCustomer() {
      chargebee.configure({
        site: CHARGEBEE_SITES.test,
        api_key: process.env[`NX_${ENV.varNames.ChargeBeeToken}`],
      });

      await new Promise((accept, reject) => {
        chargebee.customer
          .create({
            id: TEST_USER,
            first_name: 'John',
            last_name: 'Doe',
            email: E2E.testEmail,
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
