import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { createUsers } from './create-users';
import { SEED_USERS } from './seed-user-data';

export const seedCognito = async () => {
  const cognito = new CognitoIdentityProviderClient({});
  const poolId = process.env['COGNITO_POOL_ID'] ?? '';
  // await deleteUsers(cognito, poolId, SEED_USERS);
  await createUsers(cognito, poolId, SEED_USERS);
};
