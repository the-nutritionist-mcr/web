import { Auth } from '@aws-amplify/auth';
import { getAppConfig } from '@tnmw/utils';

export const configureCognitoAndSignIn = async (
  username: string,
  password: string
) => {
  const outputs = await getAppConfig();

  const REGION = 'eu-west-2';

  Auth.configure({
    Auth: {
      region: REGION,
      userPoolId: outputs.UserPoolId,
      userPoolWebClientId: outputs.ClientId,
    },
  });
  return Auth.signIn({ username, password });
};
