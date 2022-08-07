import { E2E } from '@tnmw/constants';
import { SeedUser } from '@tnmw/seed-cognito';

export const SEED_USERS: SeedUser[] = [
  {
    otherAttributes: [
      {
        Name: 'given_name',
        Value: 'Cypress',
      },

      {
        Name: 'family_name',
        Value: 'Tester',
      },
    ],

    username: E2E.adminUserOne.username,
    password: E2E.adminUserOne.password,
    email: E2E.adminUserOne.email,
    state: 'Complete',
    groups: ['admin'],
  },
  {
    otherAttributes: [
      {
        Name: 'given_name',
        Value: 'Cypress',
      },

      {
        Name: 'family_name',
        Value: 'Tester2',
      },
    ],
    username: E2E.normalUserOne.username,
    password: E2E.normalUserOne.password,
    email: E2E.normalUserOne.email,
    state: 'Complete',
  },
  {
    otherAttributes: [
      {
        Name: 'given_name',
        Value: E2E.testCustomer.firstName,
      },
      {
        Name: 'family_name',
        Value: E2E.testCustomer.surname,
      },
      {
        Name: 'custom:plans',
        Value: E2E.testCustomer.plans,
      },
      {
        Name: 'custom:deliveryDay1',
        Value: E2E.testCustomer.deliveryDay1,
      },
      {
        Name: 'custom:deliveryDay2',
        Value: E2E.testCustomer.deliveryDay2,
      },
    ],
    username: E2E.testCustomer.username,
    password: E2E.testCustomer.password,
    email: E2E.testCustomer.email,
    state: 'Complete',
  },
];
