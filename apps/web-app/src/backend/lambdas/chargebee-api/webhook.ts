import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

import { returnErrorResponse } from '../data-api/return-error-response';

import { ENV, HTTP } from '@tnmw/constants';
import { handleCustomerCreatedEvent } from './event-handlers/customer-created';
import { handleSubscriptionCreatedEvent } from './event-handlers/subscription-created';
import { authoriseBasic } from '../data-api/authorise';
import { getEnv } from './get-env';

const chargebee = new ChargeBee();

chargebee.configure({
  site: process.env[ENV.varNames.ChargeBeeSite],
  api_key: process.env[ENV.varNames.ChargeBeeToken],
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const username = getEnv(ENV.varNames.ChargeBeeWebhookUsername);
    const password = getEnv(ENV.varNames.ChargeBeeWebhookPasssword);

    authoriseBasic(event, username, password);

    const chargebeeEvent = chargebee.event.deserialize(event.body);

    const { email } = chargebeeEvent.content['customer'];

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
        await handleCustomerCreatedEvent(chargebee, chargebeeEvent);
        break;

      case 'subscription_created':
      case 'subscription_changed':
        await handleSubscriptionCreatedEvent(chargebee, chargebeeEvent);
        break;
    }

    return {
      statusCode: HTTP.statusCodes.Ok,
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
