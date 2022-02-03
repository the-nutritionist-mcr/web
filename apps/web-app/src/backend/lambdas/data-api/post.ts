import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { v4 } from 'uuid';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { authorise } from './authorise';
import { returnErrorResponse } from './return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authorise(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const id = v4();

    const command = new PutCommand({
      TableName: process.env['DYNAMODB_TABLE'],
      Item: { ...JSON.parse(event.body), id },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: id }),

      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
