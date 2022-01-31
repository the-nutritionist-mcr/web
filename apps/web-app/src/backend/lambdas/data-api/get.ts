import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const dynamodb = new DynamoDBClient({});
  const client = DynamoDBDocumentClient.from(dynamodb);

  const command = new ScanCommand({ TableName: process.env['DYNAMODB_TABLE'] });

  const { Items: items } = await client.send(command);

  const body = JSON.stringify({
    items,
  });

  return {
    statusCode: 200,
    body,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
    },
  };
};
