import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamodb = new DynamoDBClient({});
  const client = DynamoDBDocumentClient.from(dynamodb);

  const command = new PutCommand({
    TableName: process.env['DYNAMODB_TABLE'],
    Item: { ...JSON.parse(event.body) },
    ConditionExpression: 'attribute_exists(id)',
  });

  await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({}),

    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
    },
  };
};
