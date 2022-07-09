export { CHARGEBEE } from './lib/chargebee';
export { IAM } from './lib/iam';
export { ENV } from './lib/env';
export { HTTP } from './lib/http';
export { COGNITO } from './lib/cognito';

export const CONTACT_EMAIL = 'hello@thenutritionistmcr.com';

export const E2E = {
  nonExistingUser: {
    username: 'test-chargebee-cypress-user-2',
    email: 'ben+e2etestinguser@thenutritionistmcr.com',
    password: 'the-cypress-test-password',
  },
  adminUserOne: {
    username: 'cypress-test-user',
    password: 'Cypress-test-password-1',
    email: 'cypress@test.com',
  },
  normalUserOne: {
    username: 'cypress-test-user-two',
    password: 'Cypress-test-password-2',
    email: 'cypress2@test.com',
  },
};

export const TNM_WEB_LOCALSTORAGE_KEY = 'tnm-web-cache';

export const NODE_OPTS = {
  EnableSourceMaps: '--enable-source-maps',
} as const;

export const MAILSLURP_INBOX =
  '435b553b-88bc-4f3e-b3be-1d73253d54f3@mailslurp.com';

export const CHARGEBEE_SITES = {
  test: 'thenutritionist-test',
} as const;

export const RESOURCES = {
  Recipe: 'recipe',
  Customisation: 'customisation',
  CookPlan: 'cook-plan',
} as const;
