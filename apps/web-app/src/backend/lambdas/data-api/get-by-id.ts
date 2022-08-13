import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // await authoriseJwt(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const ids = event.queryStringParameters.ids.split(',');

    const command = new BatchGetCommand({
      RequestItems: {
        [process.env['DYNAMODB_TABLE']]: {
          Keys: ids.map((id: string) => ({ id })),
        },
      },
    });

    const response = await client.send(command);

    const items = response.Responses[process.env['DYNAMODB_TABLE']];

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
