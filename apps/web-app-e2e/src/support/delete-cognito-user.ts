import { ENV } from '@tnmw/constants';

import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoUser = async (username: string) => {
  try {
    const cognito = new CognitoIdentityProviderClient({
      region: 'eu-west-2',
    });

    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];
    const deleteCommand = new AdminDeleteUserCommand({
      UserPoolId: pool,
      Username: username,
    });

    await cognito.send(deleteCommand);
    return null;
  } catch (error) {
    console.log(`Failed to delete: ${error.message}`);
    return null;
    // swallow user doesn't exist error
  }
};
