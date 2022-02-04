/* eslint-disable no-console */
import { CognitoIdentityServiceProvider } from 'aws-sdk';
console.log('before');
import * as seed from './seed-cognito';
console.log('after');

console.log(seed);

const { seedCognito } = seed;

const cognito = new CognitoIdentityServiceProvider({ region: 'eu-west-2' });
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const plugins = (on, config) => {
  // eslint-disable-next-line unicorn/prefer-module
  require('@cypress/code-coverage/task')(on, config);

  on('task', {
    async seedCognito({
      poolId,
      email,
      password,
      registerUser,
      testUserEmail,
      testUserPassword,
    }: {
      poolId: string;
      email: string;
      password: string;
      registerUser: string;
      testUserEmail: string;
      testUserPassword: string;
    }) {
      await seedCognito(
        poolId,
        email,
        password,
        registerUser,
        testUserEmail,
        testUserPassword
      );
      return null;
    },
    async adminConfirmSignup({ user, pool }: { user: string; pool: string }) {
      await cognito
        .adminConfirmSignUp({
          UserPoolId: pool,
          Username: user,
        })
        .promise();

      return null;
    },
  });
  return config;
};

export default plugins;
