import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { returnErrorResponse } from '../data-api/return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  try {
    console.log(JSON.stringify(event))
    // Not yet implemented
  } catch (error) {
    return returnErrorResponse(error);
  }
};
