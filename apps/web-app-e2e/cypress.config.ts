import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: './src/support/index.ts',
    specPattern: 'e2e/**/*.cy.{ts,tsx}',
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
