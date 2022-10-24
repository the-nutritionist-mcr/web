import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';
import { scan } from './get-data/scan';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const items = await scan(client, process.env['DYNAMODB_TABLE'] ?? '');

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
    if (error instanceof Error) {
      return returnErrorResponse(error);
    }

    return returnErrorResponse();
  }
};
