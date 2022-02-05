import { CdkCustomResourceHandler } from 'aws-lambda';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  USER_POOL_ID_ENV_KEY_STRING,
  SEED_USERS_ENV_KEY_STRING,
} from './constants';
import { SeedUser } from './types';

export const handler: CdkCustomResourceHandler = async (event) => {
  const cognito = new CognitoIdentityProviderClient({});
  const poolId = process.env[USER_POOL_ID_ENV_KEY_STRING];

  const users: SeedUser[] = JSON.parse(
    process.env[SEED_USERS_ENV_KEY_STRING] ?? ''
  );
  if (event.RequestType === 'Update') {
    const userPromises = users.map(async (user) => {
      try {
        const deleteCommand = new AdminDeleteUserCommand({
          UserPoolId: poolId,
          Username: user.username,
        });

        await cognito.send(deleteCommand);
      } catch {
        // Swallow failure - in case seed data was deleted in test
      }
    });

    await Promise.all(userPromises);
  }

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const userPromises = users.map(async (user) => {
      const initialPassword =
        user.state === 'Complete' ? '^2Y.AD`5`$A!&pS\\' : user.password;
      const command = new AdminCreateUserCommand({
        UserPoolId: poolId,
        Username: user.username,
        TemporaryPassword: initialPassword,
        MessageAction: 'SUPPRESS',
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
          {
            Name: 'email',
            Value: user.email,
          },
          {
            Name: 'email_verified',
            Value: 'True',
          },
          {
            Name: 'phone_number_verified',
            Value: 'True',
          },
        ],
      });

      await cognito.send(command);

      if (user.state === 'Complete') {
        const changeCommand = new AdminSetUserPasswordCommand({
          Password: user.password,
          Permanent: true,
          Username: user.username,
          UserPoolId: poolId,
        });

        await cognito.send(changeCommand);
      }
    });

    await Promise.all(userPromises);
  }
  return {};
};
