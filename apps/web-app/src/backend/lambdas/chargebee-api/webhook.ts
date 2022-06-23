import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

import { returnErrorResponse } from '../data-api/return-error-response';

import { ENV, HTTP } from '@tnmw/constants';
import { handleCustomerEvent } from './event-handlers/handle-customer-event';
import { handleSubscriptionEvent } from './event-handlers/handle-subscription-event';
import { authoriseBasic } from '../data-api/authorise';
import { getEnv } from './get-env';
import { getSecrets } from '../get-secrets';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const chargebee = new ChargeBee();

  const [chargebeeToken, chargebeeWebhookUsername, chargebeeWebhookPassword] =
    getSecrets(
      getEnv(ENV.varNames.ChargeBeeToken),
      getEnv(ENV.varNames.ChargeBeeWebhookUsername),
      getEnv(ENV.varNames.ChargeBeeWebhookPasssword)
    );

  chargebee.configure({
    site: process.env[ENV.varNames.ChargeBeeSite],
    api_key: await chargebeeToken,
  });

  try {
    authoriseBasic(
      event,
      await chargebeeWebhookUsername,
      await chargebeeWebhookPassword
    );

    const chargebeeEvent = chargebee.event.deserialize(event.body);

    const { email } = chargebeeEvent.content['customer'];

    const environment = process.env[ENV.varNames.EnvironmentName];

    if (
      environment !== 'prod' &&
      (!email || !email.trim().toLowerCase().endsWith('thenutritionistmcr.com'))
    ) {
      return {
        statusCode: HTTP.statusCodes.Ok,
      };
    }

    switch (chargebeeEvent.event_type) {
      case 'customer_created':
      case 'customer_changed':
        await handleCustomerEvent(chargebee, chargebeeEvent);
        break;

      case 'subscription_created':
      case 'subscription_started':
      case 'subscription_renewed':
      case 'subscription_deleted':
      case 'subscription_resumed':
      case 'subscription_activated':
      case 'subscription_cancelled':
      case 'subscription_changed':
        await handleSubscriptionEvent(chargebee, chargebeeEvent);
        break;
    }

    return {
      statusCode: HTTP.statusCodes.Ok,
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
