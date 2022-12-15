import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';
import { scan } from './get-data/scan';
import { returnOkResponse } from './return-ok-response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const items = await scan(client, process.env['DYNAMODB_TABLE'] ?? '');

    const body = {
      items: items.filter((item) => !item.deleted),
    };

    returnOkResponse(body);
  } catch (error) {
    return returnErrorResponse(error);
  }
};
