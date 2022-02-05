import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
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
};
