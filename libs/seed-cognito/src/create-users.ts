import {
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { SeedUser } from './types';

export const createUsers = async (
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  users: SeedUser[]
) => {
  const userPromises = users.map(async (user) => {
    const initialPassword =
      user.state === 'Complete' ? '^2Y.AD`5`$A!&pS\\' : user.password;

    try {
      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: poolId,
        Username: user.username,
      });

      await cognito.send(deleteCommand);
    } catch {
      // Swallow failures
    }

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
        ...(user.otherAttributes ?? []),
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

    const groupPromises =
      user.groups?.map(async (group) => {
        const addToGroupCommand = new AdminAddUserToGroupCommand({
          UserPoolId: poolId,
          Username: user.username,
          GroupName: group,
        });

        await cognito.send(addToGroupCommand);
      }) ?? [];

    await Promise.all(groupPromises);
  });

  await Promise.all(userPromises);
};
