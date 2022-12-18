import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AttributeType,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

type SeedUserState = 'Complete' | 'ForceChangePassword';

export interface SeedUser {
  username: string;
  password?: string;
  groups?: string[];
  email: string;
  state: SeedUserState;
  otherAttributes?: AttributeType[];
}

const wait = (duration: number) =>
  new Promise((accept) => setTimeout(accept, duration));

const createUser = async (
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  user: SeedUser,
  attempt?: number
) => {
  try {
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
  } catch {
    if (!attempt || attempt < 4) {
      await wait(1000);
      await createUser(cognito, poolId, user, (attempt ?? 0) + 1);
    }
  }
};

export const createUsers = async (
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  users: SeedUser[]
) => {
  await users.reduce(async (lastPromise, user) => {
    await lastPromise;
    await createUser(cognito, poolId, user);
  }, Promise.resolve());

  await users.reduce(async (lastPromise, user) => {
    await lastPromise;
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
  }, Promise.resolve());
};
