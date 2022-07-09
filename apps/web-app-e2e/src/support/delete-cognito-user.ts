import { ENV } from '@tnmw/constants';

import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoUser = async (username: string) => {
  try {
    const cognito = new CognitoIdentityProviderClient({
      regino: 'eu-west-2',
    });
    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];
    const deleteCommand = new AdminDeleteUserCommand({
      UserPoolId: pool,
      Username: username,
    });

    await cognito.send(deleteCommand);
    return null;
  } catch {
    return null;
    // swallow user doesn't exist error
  }
};
