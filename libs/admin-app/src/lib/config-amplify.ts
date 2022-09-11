import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { assertIsBackendOutputs } from '../types/backend-outputs';

export const configAmplify = async (): Promise<void> => {
  const configResponse = await fetch(
    `${process.env.PUBLIC_URL}/backend-outputs.json`
  );

  const backendConfig: unknown = await configResponse.json();

  assertIsBackendOutputs(backendConfig);

  const stackConfigKey =
    Object.keys(backendConfig).find((key) => key.includes('BackendStack')) ??
    Object.keys(backendConfig).find((key) => key.includes('backend-stack')) ??
    '';

  const configObject = backendConfig[stackConfigKey];

  const config = {
    /* eslint-disable @typescript-eslint/naming-convention */
    Auth: {
      mandatorySignIn: true,
      region: 'eu-west-2',
      userPoolId: configObject.UserPoolId,
      userPoolWebClientId: configObject.ClientId,
    },
    aws_appsync_graphqlEndpoint: configObject.GraphQlQpiUrl,
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    graphql_endpoint_iam_region: 'eu-west-2',
    /* eslint-enable @typescript-eslint/naming-convention */
  };

  Amplify.configure(config);
  Auth.configure(config);
};
