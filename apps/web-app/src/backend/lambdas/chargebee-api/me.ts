import { ENV } from '../../../infrastructure/constants';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';

const chargebee = new ChargeBee();

chargebee.configure({
  site: process.env[ENV.varNames.ChargeBeeSite],
  api_key: process.env[ENV.varNames.ChargeBeeToken],
});

import { authorise } from '../data-api/authorise';
import { returnErrorResponse } from '../data-api/return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { username } = await authorise(event, ['admin']);

    const result = await chargebee.customer.retrieve(username).request();

    const { first_name, last_name, email, billing_address, phone } = result.customer;
    const { line1, line2, line3, city, country } = billing_address ?? {};

    return {
      statusCode: 200,
      body: JSON.stringify({
        phone,
        first_name,
        last_name,
        email,
        address_line1: line1,
        address_line2: line2,
        address_line3: line3,
        city,
        country,
      }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
