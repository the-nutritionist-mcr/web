import { E2E, COGNITO } from '@tnmw/constants';
import { SeedUser } from '@tnmw/seed-cognito';
import { BackendCustomer } from '@tnmw/types';

const toDynamo = (
  user: Partial<Omit<BackendCustomer, 'plans'>> & {
    phoneNumberFull?: string;
    plans?: string;
  },
  password: string,
  state: 'Complete' | 'ForceChangePassword',
  groups: string[]
): SeedUser => {
  const otherAttributes = [
    {
      Name: `custom:${COGNITO.customAttributes.Postcode}`,
      Value: user.postcode,
    },
    {
      Name: `custom:${COGNITO.customAttributes.Country}`,
      Value: user.country,
    },
    {
      Name: COGNITO.standardAttributes.firstName,
      Value: user.firstName,
    },
    {
      Name: COGNITO.standardAttributes.surname,
      Value: user.surname,
    },
    {
      Name: COGNITO.standardAttributes.phone,
      Value: user.phoneNumberFull,
    },
    {
      Name: `custom:${COGNITO.customAttributes.DeliveryDay1}`,
      Value: user.deliveryDay1,
    },
    {
      Name: `custom:${COGNITO.customAttributes.DeliveryDay2}`,
      Value: user.deliveryDay2,
    },
    {
      Name: `custom:${COGNITO.customAttributes.AddressLine1}`,
      Value: user.addressLine1,
    },
    {
      Name: `custom:${COGNITO.customAttributes.AddressLine2}`,
      Value: user.addressLine2,
    },
    {
      Name: `custom:${COGNITO.customAttributes.AddressLine3}`,
      Value: user.addressLine3,
    },
    {
      Name: `custom:${COGNITO.customAttributes.City}`,
      Value: user.city,
    },
    {
      Name: `custom:${COGNITO.customAttributes.Plans}`,
      Value: user.plans,
    },
  ];

  return {
    otherAttributes: otherAttributes.filter((attr) => Boolean(attr.Value)),
    username: user.username ?? '',
    password,
    email: user.email ?? '',
    state,
    groups,
  };
};

export const SEED_USERS: SeedUser[] = [
  toDynamo(E2E.adminUserOne, E2E.adminUserOne.password, 'Complete', ['admin']),
  toDynamo(E2E.adminUserTwo, E2E.adminUserTwo.password, 'Complete', ['admin']),
  toDynamo(E2E.normalUserOne, E2E.normalUserOne.password, 'Complete', []),
  toDynamo(
    E2E.anotherE2ECustomer,
    E2E.anotherE2ECustomer.password,
    'Complete',
    []
  ),
  toDynamo(
    E2E.anotherE2ECustomerAgain,
    E2E.anotherE2ECustomerAgain.password,
    'Complete',
    []
  ),
  toDynamo(E2E.e2eCustomer2, E2E.e2eCustomer2.password, 'Complete', []),
  ...Array.from({ length: 40 }).map((item, index) => {
    const [first, second] = E2E.testCustomer.email.split('+');
    const email = [first, '+', String(index), second].join('');

    return toDynamo(
      { ...E2E.testCustomer, email, username: `test-customer-${index}` },
      E2E.testCustomer.password,
      'Complete',
      []
    );
  }),
];
