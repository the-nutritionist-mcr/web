import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { parseCognitoResponse } from './parse-cognito-response';

export const getUserFromAws = async (username: string) => {
  const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  const userResult = await cognito.send(
    new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: username,
    })
  );

  return {
    ...parseCognitoResponse(userResult.UserAttributes ?? []),
    username: userResult.Username ?? '',
    id: userResult.Username ?? '',
  };
};
