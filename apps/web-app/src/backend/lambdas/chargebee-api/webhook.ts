import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

import { returnErrorResponse } from '../data-api/return-error-response';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput
} from '@aws-sdk/client-cognito-identity-provider';

import { ENV, HTTP, USER_ATTRIBUTES } from '../../../infrastructure/constants';

const chargebee = new ChargeBee();

chargebee.configure({
  site: process.env[ENV.varNames.ChargeBeeSite],
  api_key: process.env[ENV.varNames.ChargeBeeToken]
});

const decodeBasicAuth = (authHeaderValue: string) => {
  const base64Encoded = authHeaderValue.split(' ')[1]
  const parts = Buffer.from(base64Encoded, 'base64').toString('utf8').split(':')

  return {
    username: parts[0],
    password: parts[1]
  }
}

export const handler: APIGatewayProxyHandlerV2 = async event => {
  try {
    const credentials = decodeBasicAuth(event.headers[HTTP.headerNames.Authorization])

    const basicUsername = process.env[ENV.varNames.ChargeBeeWebhookUsername]
    const basicPassword = process.env[ENV.varNames.ChargeBeeWebhookPasssword]

    if(credentials.username !== basicUsername || credentials.password !== basicPassword) {
      return {
        statusCode: HTTP.statusCodes.Forbidden
      }
    }

    const chargebeeEvent = chargebee.event.deserialize(event.body);
    const poolId = process.env[ENV.varNames.CognitoPoolId];

    const { id, email, first_name, last_name } = chargebeeEvent.content.customer;

    const environment = process.env[ENV.varNames.EnvironmentName]

    if(environment !== 'prod' && !email.trim().toLowerCase().endsWith('thenutritionistmcr.com')) {
      return {
        statusCode: HTTP.statusCodes.Ok
      };
    }

    if (chargebeeEvent.event_type === 'customer_created') {
      const input: AdminCreateUserCommandInput = {
        UserPoolId: poolId,
        Username: id,
        UserAttributes: [
          {
            Name: `custom:${USER_ATTRIBUTES.ChargebeeId}`,
            Value: id
          },
          {
            Name: `email`,
            Value: email
          },
          {
            Name: `email_verified`,
            Value: `true`
          },
          {
            Name: `given_name`,
            Value: first_name
          },
          {
            Name: `family_name`,
            Value: last_name
          }
        ]
      };

      const command = new AdminCreateUserCommand(input);

      const client = new CognitoIdentityProviderClient({});

      await client.send(command);

      return {
        statusCode: HTTP.statusCodes.Ok
      };
    }
  } catch (error) {
    return returnErrorResponse(error);
  }
};
