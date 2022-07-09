import { createChargebeeCustomer } from './src/support/create-chargebee-customer';
import { deleteChargebeeCustomer } from './src/support/delete-chargebee-customer';
import { deleteCognitoUser } from './src/support/delete-cognito-user';
import { pollForPasswordFromMostRecentWelcomeEmailThenDelete } from './src/support/get-password-from-welcome-email';
import { defineConfig } from 'cypress';
import { E2E } from '@tnmw/constants';

export default defineConfig({
  viewportHeight: 1011,
  viewportWidth: 1438,
  scrollBehaviour: false,
  e2e: {
    supportFile: './src/support/index.ts',
    specPattern: 'e2e/**/*.cy.{ts,tsx}',
    setupNodeEvents(on) {
      on('task', {
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
    CYPRESS_POOL_ID: 'eu-west-2_844S8k2dn',
  },

  videosFolder: '../../dist/cypress/apps/web-app-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-app-e2e/screenshots',
  video: true,
  chromeWebSecurity: false,
});

//"modifyObstructiveCode": false,
//"integrationFolder": "./src/integration",
// "pluginsFile": "./src/support/plugins.ts",
