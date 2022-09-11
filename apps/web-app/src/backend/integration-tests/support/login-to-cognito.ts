/* eslint-disable @typescript-eslint/naming-convention */
import { Auth } from '@aws-amplify/auth';
import Amplify from '@aws-amplify/core';

export const loginToCognito = async (
  user: string,
  password: string
): Promise<string> => {
  const amplifyConfig = {
    Auth: {
      region: 'eu-west-2',
      userPoolId: process.env.COGNITO_POOL_ID,
      userPoolWebClientId: process.env.COGNITO_POOL_CLIENT_ID,
    },
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    graphql_endpoint_iam_region: 'eu-west-2',
  };

  Amplify.configure(amplifyConfig);
  Auth.configure(amplifyConfig);

  const signIn = await Auth.signIn({
    username: user,
    password: password,
  });

  return signIn.signInUserSession.accessToken.jwtToken;
};
