import {
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const userExists = async (id: string, userPool: string) => {
  try {
    const cognito = new CognitoIdentityProviderClient({});
    const input: AdminGetUserCommandInput = {
      UserPoolId: userPool,
      Username: id,
    };

    const command = new AdminGetUserCommand(input);

    await cognito.send(command);
    return true;
  } catch {
    return false;
  }
};
