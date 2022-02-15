import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

import { returnErrorResponse } from '../data-api/return-error-response';

import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ENV, HTTP, USER_ATTRIBUTES, E2E } from '@tnmw/constants';
import { createUser } from './create-user';

const chargebee = new ChargeBee();

chargebee.configure({
  site: process.env[ENV.varNames.ChargeBeeSite],
  api_key: process.env[ENV.varNames.ChargeBeeToken],
});

const decodeBasicAuth = (authHeaderValue: string) => {
  const base64Encoded = authHeaderValue.split(' ')[1];
  const parts = Buffer.from(base64Encoded, 'base64')
    .toString('utf8')
    .split(':');

  return {
    username: parts[0],
    password: parts[1],
  };
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const credentials = decodeBasicAuth(
      event.headers[HTTP.headerNames.Authorization]
    );

    const basicUsername = process.env[ENV.varNames.ChargeBeeWebhookUsername];
    const basicPassword = process.env[ENV.varNames.ChargeBeeWebhookPasssword];

    if (
      credentials.username !== basicUsername ||
      credentials.password !== basicPassword
    ) {
      return {
        statusCode: HTTP.statusCodes.Forbidden,
      };
    }

    const chargebeeEvent = chargebee.event.deserialize(event.body);
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const { id, email, first_name, last_name } =
      chargebeeEvent.content.customer;

    const environment = process.env[ENV.varNames.EnvironmentName];

    if (
      environment !== 'prod' &&
      !email.trim().toLowerCase().endsWith('thenutritionistmcr.com')
    ) {
      return {
        statusCode: HTTP.statusCodes.Ok,
      };
    }

    if (chargebeeEvent.event_type === 'customer_created') {
      await createUser({
        first_name,
        last_name,
        username: id,
        poolId,
        email,
      });

      if (
        environment !== 'prod' &&
        email.trim().toLowerCase() === E2E.testEmail
      ) {
        const client = new CognitoIdentityProviderClient({});

        const params = {
          Password: E2E.testPassword,
          Permanent: true,
          Username: id,
          UserPoolId: poolId,
        };
        const changeCommand = new AdminSetUserPasswordCommand(params);
        await client.send(changeCommand);
      }

      return {
        statusCode: HTTP.statusCodes.Ok,
      };
    }
  } catch (error) {
    return returnErrorResponse(error);
  }
};
