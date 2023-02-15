import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';
import { scan } from '@tnmw/dynamo';
import { returnOkResponse } from './return-ok-response';
import { warmer } from '../misc/warmer';
import { PAGE_SIZE } from '@tnmw/constants';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);
    const table = process.env['DYNAMODB_TABLE'] ?? '';

    const projection = event.queryStringParameters?.projection?.split(',');

    const pageParam = event.queryStringParameters?.page;

    const page = Number(pageParam);

    const getPagesCommand = new GetCommand({
      TableName: table,
      Key: { id: 'pages' },
    });

    const pages = await client.send(getPagesCommand);

    const pageId = pages.Item?.pages[page - 2];

    const start = pageParam && page !== 1 ? { id: pageId } : undefined;

    const items = await scan(
      client,
      table,
      pageParam ? start : undefined,
      projection ? [...projection, 'deleted', 'count', 'pages'] : undefined,
      pageParam ? PAGE_SIZE : undefined
    );

    const body = {
      count: pages.Item?.count,
      items: items.filter(
        (item) => !item.deleted && item.id !== 'count' && item.id !== 'pages'
      ),
    };

    return returnOkResponse(body);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
