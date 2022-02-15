import { USER_ATTRIBUTES } from '@tnmw/constants';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

export const createUser = async ({
  poolId,
  email,
  username,
  last_name,
  first_name,
}: {
  poolId: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}) => {
  const input: AdminCreateUserCommandInput = {
    UserPoolId: poolId,
    Username: username,
    UserAttributes: [
      {
        Name: `custom:${USER_ATTRIBUTES.ChargebeeId}`,
        Value: username,
      },
      {
        Name: `email`,
        Value: email,
      },
      {
        Name: `email_verified`,
        Value: `true`,
      },
      {
        Name: `given_name`,
        Value: first_name,
      },
      {
        Name: `family_name`,
        Value: last_name,
      },
    ],
  };

  const command = new AdminCreateUserCommand(input);

  const client = new CognitoIdentityProviderClient({});

  await client.send(command);
};
