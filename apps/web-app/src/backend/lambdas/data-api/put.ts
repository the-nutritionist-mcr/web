import 'dd-trace/init';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { returnErrorResponse } from './return-error-response';
import { authoriseJwt } from './authorise';
import { warmer } from '../misc/warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const dynamodb = new DynamoDBClient({});

    const client = DynamoDBDocumentClient.from(dynamodb);

    const command = new PutCommand({
      TableName: process.env['DYNAMODB_TABLE'],
      Item: { ...JSON.parse(event.body ?? '') },
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
  } catch (error) {
    return returnErrorResponse(error);
  }
});
