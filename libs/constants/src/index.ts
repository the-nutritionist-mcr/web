export { CHARGEBEE } from './lib/chargebee';
export { IAM } from './lib/iam';
export { ENV } from './lib/env';
export { HTTP } from './lib/http';
export { COGNITO } from './lib/cognito';

export const CONTACT_EMAIL = 'hello@thenutritionistmcr.com';

export const ORDERS_EMAIL = 'jess+orders@thenutritionistmcr.com';

export const E2E = {
  testPassword: 'test-password',
  nonExistingUser: {
    username: 'test-chargebee-cypress-user-2',
    email: 'ben+e2etestinguser@thenutritionistmcr.com',
    password: 'password',
  },
  adminUserOne: {
    username: 'cypress-test-user',
    password: 'password',
    email: 'cypress@test.com',
  },
  adminUserTwo: {
    username: 'cypress-test-user-2',
    password: 'password',
    email: 'cypress2@test.com',
  },
  normalUserOne: {
    username: 'cypress-test-user-two',
    password: 'password',
    email: 'cypress3@test.com',
  },
  e2eCustomer: {
    username: 'e2e-customer',
    postcode: 'M1 2AB',
    password: 'password',
    email: 'ben+testcustomeragain@thenutritionistmcr.com',
    country: 'England',
    firstName: 'E2E',
    phoneNumber: '07812345678',
    surname: 'Customer',
    deliveryDay1: 'Monday',
    deliveryDay2: 'Wednesday',
    addressLine1: 'Flat 5, Block C',
    addressLine2: 'Albion Works',
    addressLine3: 'New Islington',
    city: 'Manchester',
    plans:
      '[{"name":"Equilibrium","daysPerWeek":6,"itemsPerDay":1,"isExtra":false,"totalMeals":6},{"name":"Breakfast","daysPerWeek":7,"itemsPerDay":1,"isExtra":true,"totalMeals":7}]',
  },
  testCustomer: {
    username: 'test-customer-1',
    postcode: 'M1 2AB',
    password: 'password',
    email: 'ben+testcustomer@thenutritionistmcr.com',
    firstName: 'Ben (test customer)',
    phoneNumber: '07812345678',
    surname: 'Wainwright',
    deliveryDay1: 'Monday',
    deliveryDay2: 'Wednesday',
    addressLine1: 'Flat 5, Block C',
    addressLine2: 'Albion Works',
    addressLine3: 'New Islington',
    city: 'Manchester',
    plans:
      '[{"name":"Equilibrium","daysPerWeek":6,"itemsPerDay":1,"isExtra":false,"totalMeals":6},{"name":"Breakfast","daysPerWeek":7,"itemsPerDay":1,"isExtra":true,"totalMeals":7}]',
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
