import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { ENV } from '@tnmw/constants';

export const handleDeleteCustomer = async (username: string) => {
  const poolId = process.env[ENV.varNames.CognitoPoolId];

  const cognito = new CognitoIdentityProviderClient({});

  const deleteCustomerCommand = new AdminDeleteUserCommand({
    Username: username,
    UserPoolId: poolId,
  });

  await cognito.send(deleteCustomerCommand);
};
