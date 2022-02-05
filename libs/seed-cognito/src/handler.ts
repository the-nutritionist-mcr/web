import { CdkCustomResourceHandler } from 'aws-lambda';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

import {
  USER_POOL_ID_ENV_KEY_STRING,
  SEED_USERS_ENV_KEY_STRING
} from './constants';
import { SeedUser } from './types';
import { deleteUsers } from './delete-users';
import { createUsers } from './create-users';

export const handler: CdkCustomResourceHandler = async event => {
  const cognito = new CognitoIdentityProviderClient({});
  const poolId = process.env[USER_POOL_ID_ENV_KEY_STRING] ?? '';

  const users: SeedUser[] = JSON.parse(
    process.env[SEED_USERS_ENV_KEY_STRING] ?? ''
  );

  if (event.RequestType === 'Update' || event.RequestType === 'Create') {
    await deleteUsers(cognito, poolId, users);
    await createUsers(cognito, poolId, users);
  }

  return {};
};
