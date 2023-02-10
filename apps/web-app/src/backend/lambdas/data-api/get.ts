import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';
import { scan } from './get-data/scan';
import { returnOkResponse } from './return-ok-response';
import { warmer } from '../misc/warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const projection = event.queryStringParameters?.projection?.split(',');

    const items = await scan(
      client,
      process.env['DYNAMODB_TABLE'] ?? '',
      undefined,
      projection ? [...projection, 'deleted'] : undefined
    );

    console.log(JSON.stringify(items, null, 2));

    const body = {
      items: items.filter((item) => !item.deleted && item.id.S !== 'count'),
    };

    return returnOkResponse(body);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
