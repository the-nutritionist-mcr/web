/* eslint-disable @typescript-eslint/naming-convention */
import { Auth } from "@aws-amplify/auth";
import Amplify from "@aws-amplify/core";
import axios from "axios";
import { assertIsBackendOutputs } from "../../types/backend-outputs";
import {
  COGNITO_PASSWORD,
  COGNITO_USER,
} from "../../../cypress/support/constants";

const getConfig = async () => {
  const rawConfig = (await import(`${process.cwd()}/backend-outputs.json`))
    .default;

  assertIsBackendOutputs(rawConfig);

  const config = Object.entries(rawConfig).find(([key]) =>
    key.includes("backend-stack")
  )?.[1];

  if (!config) {
    throw new Error("Could not load backend config :-(");
  }
  return config;
};

export const loginToCognito = async (): Promise<string> => {
  const config = await getConfig();

  const amplifyConfig = {
    Auth: {
      region: "us-east-1",
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.ClientId,
    },
    aws_appsync_graphqlEndpoint: config.GraphQlQpiUrl,
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
    graphql_endpoint_iam_region: "us-east-1",
  };

  Amplify.configure(amplifyConfig);
  Auth.configure(amplifyConfig);

  const signIn = await Auth.signIn({
    username: COGNITO_USER,
    password: COGNITO_PASSWORD,
  });

  return signIn.signInUserSession.accessToken.jwtToken;
};

export const query = async (
  inputQuery: { query: string; variables: Record<string, unknown> },
  token: string
) => {
  const config = await getConfig();

  return await axios.post(config.GraphQlQpiUrl, inputQuery, {
    headers: { Authorization: token },
  });
};
