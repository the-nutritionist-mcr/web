import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { authorise } from './authorise';

import { returnErrorResponse } from './return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    authorise(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const command = new ScanCommand({
      TableName: process.env['DYNAMODB_TABLE'],
    });

    const { Items: items } = await client.send(command);

    const body = JSON.stringify({
      items: items.filter((item) => !item.deleted),
    });

    return {
      statusCode: 200,
      body,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
