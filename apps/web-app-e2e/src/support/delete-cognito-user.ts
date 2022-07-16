import { ENV } from '@tnmw/constants';

import {
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoUser = async (username: string) => {
  try {
    console.log(`Deleting cognito user '${username}'`);
    const cognito = new CognitoIdentityProviderClient({
      region: `us-east-1`,
    });

    const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];

    const params: AdminDeleteUserCommandInput = {
      UserPoolId: pool,
      Username: username,
    };

    const deleteCommand = new AdminDeleteUserCommand(params);

    await cognito.send(deleteCommand);
    console.log('Cognito user deleted');
    return null;
  } catch (error) {
    console.log(`Failed to delete cognito user: ${error.message}`);
    return null;
    // swallow user doesn't exist error
  }
};
