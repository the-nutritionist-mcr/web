import { ENV } from '@tnmw/constants';

import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const deleteCognitoUser = async (username: string) => {
  const cognito = new CognitoIdentityProviderClient({
    region: 'eu-west-2',
  });
  const pool = process.env[`NX_${ENV.varNames.CognitoPoolId}`];
  const deleteCommand = new AdminDeleteUserCommand({
    UserPoolId: pool,
    Username: username,
  });

  await cognito.send(deleteCommand);
};
