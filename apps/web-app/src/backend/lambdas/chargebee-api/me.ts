import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { authorise } from '../data-api/authorise';

import { returnErrorResponse } from '../data-api/return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  try {
    authorise(event, ['admin']);

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
