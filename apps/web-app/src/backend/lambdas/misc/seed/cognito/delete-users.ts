import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { SeedUser } from './cognito';

export const deleteUsers = async (
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  users: SeedUser[]
) => {
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
};
