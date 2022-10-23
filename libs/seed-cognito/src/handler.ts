import { CdkCustomResourceHandler } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

import {
  USER_POOL_ID_ENV_KEY_STRING,
  SEED_DATA_BUCKET_KEY_STRING,
  SEED_DATA_FILE_NAME,
} from './constants';
import { SeedUser } from './types';
import { deleteUsers } from './delete-users';
import { createUsers } from './create-users';

export const handler: CdkCustomResourceHandler = async (event) => {
  const cognito = new CognitoIdentityProviderClient({});
  const s3 = new S3Client({});

  const command = new GetObjectCommand({
    Bucket: process.env[SEED_DATA_BUCKET_KEY_STRING],
    Key: SEED_DATA_FILE_NAME,
  });

  const response = await s3.send(command);

  const users: SeedUser[] = JSON.parse(
    (await response.Body?.transformToString()) ?? '[]'
  );

  const poolId = process.env[USER_POOL_ID_ENV_KEY_STRING] ?? '';

  if (event.RequestType === 'Update' || event.RequestType === 'Create') {
    await deleteUsers(cognito, poolId, users);
    await createUsers(cognito, poolId, users);
  }

  return {};
};
