import { ENV } from '@tnmw/constants';

import {
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoUser = async (username: string) => {
  try {
    const cognito = new CognitoIdentityProviderClient({
      region: 'eu-west-2',
    });

    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];

    const params: AdminDeleteUserCommandInput = {
      UserPoolId: pool,
      Username: username,
    };

    console.log(params);

    const deleteCommand = new AdminDeleteUserCommand(params);

    await cognito.send(deleteCommand);
    return null;
  } catch (error) {
    console.log(`Failed to delete: ${error.message}`);
    return null;
    // swallow user doesn't exist error
  }
};
