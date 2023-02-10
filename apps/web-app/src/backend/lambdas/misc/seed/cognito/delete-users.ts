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
  const extraUsers = Array.from({ length: 80 })
    .map((_, index) => index + 50)
    .map((number) => ({ username: `test-customer-${number}` }));
  const userPromises = [...extraUsers, ...users].map(async (user) => {
    try {
      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: poolId,
        Username: user.username,
      });

      console.log(user.username);
      await cognito.send(deleteCommand);
      console.log(`Deleted: ${user.username}`);
    } catch (error) {
      console.log(`Failed: ${user.username}`);
      console.log(error);
      // Swallow failure - in case seed data was deleted in test
    }
  });

  await Promise.all(userPromises);
};
