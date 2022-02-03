import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
// import { ChargeBee } from 'chargebee-typescript';

// const chargebee = new ChargeBee();

// chargebee.configure({
//   site: 'thenutritionist-test',
//   api_key: 'test_Tv0orhs9B9cFhIWTl6UKqT8ej1ltFZdo',
// });

import { authorise } from '../data-api/authorise';

import { returnErrorResponse } from '../data-api/return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  try {
    await authorise(event, ['admin']);
    return {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*'
      }
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
