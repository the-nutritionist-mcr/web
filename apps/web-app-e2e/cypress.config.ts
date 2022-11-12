import { createChargebeeCustomer } from './src/support/create-chargebee-customer';
import { deleteChargebeeCustomer } from './src/support/delete-chargebee-customer';
import { deleteCognitoUser } from './src/support/delete-cognito-user';
import { pollForPasswordFromMostRecentWelcomeEmailThenDelete } from './src/support/google/get-password-from-welcome-email';
import { deleteAllCypressWelcomeEmails } from './src/support/google/delete-all-cypress-welcome-emails';
import { defineConfig } from 'cypress';
import { E2E } from '@tnmw/constants';
import { addSubscription } from './src/support/add-subscription';

export default defineConfig({
  viewportHeight: 1011,
  viewportWidth: 1438,
  scrollBehavior: 'center',
  e2e: {
    experimentalSessionAndOrigin: true,
    baseUrl: 'http://localhost:4200',
    defaultCommandTimeout: 25_000,
    supportFile: './src/support/index.ts',
    specPattern: 'e2e/**/*.cy.{ts,tsx}',
    // reporter: 'cypress-multi-reporters',
    // reporterOptions: {
    //   configFile: 'reporter-config.json',
    // },
    setupNodeEvents(on) {
      on('task', {
        deleteWelcomeEmails: () => {
          return deleteAllCypressWelcomeEmails(E2E.nonExistingUser.email);
        },
        addSubscription: (input: {
          customerId: string;
          planId: string;
          price: number;
        }) => addSubscription(input.customerId, input.planId, input.price),
        deleteCognitoUser: deleteCognitoUser,
        deleteChargebeeCustomer: deleteChargebeeCustomer,
        createChargebeeCustomer: createChargebeeCustomer,
        getPasswordFromWelcomeEmailThenDelete: () => {
          return pollForPasswordFromMostRecentWelcomeEmailThenDelete(
            E2E.nonExistingUser.email
          );
        },
      });
    },
  },
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  env: {
    CYPRESS_TEST_USER_NAME: 'test-cypress-user',
    CYPRESS_TEST_USER_INITIAL_PASSWORD: 'test-cypress-password',
    CYPRESS_TEST_REGISTER_USER: 'test-cypress-register-user',
    CYPRESS_POOL_ID: 'eu-west-2_77z37j3Fb',
  },

  videosFolder: '../../dist/cypress/apps/web-app-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-app-e2e/screenshots',
  video: true,
  chromeWebSecurity: false,
});

//"modifyObstructiveCode": false,
//"integrationFolder": "./src/integration",
// "pluginsFile": "./src/support/plugins.ts",
