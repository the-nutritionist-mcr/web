import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

import { returnErrorResponse } from '../data-api/return-error-response';

import { ENV, HTTP } from '@tnmw/constants';
import { handleCustomerCreatedEvent } from './event-handlers/customer-created';
import { handleSubscriptionCreatedEvent } from './event-handlers/subscription-created';

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

    const { email } = chargebeeEvent.content.customer;

    const environment = process.env[ENV.varNames.EnvironmentName];

    if (
      environment !== 'prod' &&
      !email.trim().toLowerCase().endsWith('thenutritionistmcr.com')
    ) {
      return {
        statusCode: HTTP.statusCodes.Ok,
      };
    }

    switch (chargebeeEvent.event_type) {
      case 'customer_created':
        return handleCustomerCreatedEvent(chargebee, chargebeeEvent);
      case 'subscription_created':
        return handleSubscriptionCreatedEvent(chargebee, chargebeeEvent);
    }
  } catch (error) {
    return returnErrorResponse(error);
  }
};
