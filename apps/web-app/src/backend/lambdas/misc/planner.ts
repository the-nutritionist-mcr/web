import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
    },
  };
};
