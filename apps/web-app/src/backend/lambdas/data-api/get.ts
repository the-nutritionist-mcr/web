import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
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
    const client = DynamoDBDocumentClient.from(dynamodb, {
      marshallOptions: { removeUndefinedValues: true },
    });

    const table = process.env['DYNAMODB_TABLE'] ?? '';
    const metaTable = process.env['DYNAMODB_TABLE_META'] ?? '';

    const projection = event.queryStringParameters?.projection?.split(',');

    const pageParam = event.queryStringParameters?.page;

    const sort = event.queryStringParameters?.sort;

    const asc = event.queryStringParameters?.asc;

    const page = Number(pageParam);

    const params = {
      RequestItems: {
        [`${metaTable}`]: {
          Keys: [{ name: 'count' }, { name: 'pages' }],
        },
      },
    };

    const batchGet = new BatchGetCommand(params);

    const pages = await client.send(batchGet);

    const pagesArray = pages?.Responses?.[metaTable].find(
      (item) => item.name === 'pages'
    )?.value;
    const count = pages?.Responses?.[metaTable].find(
      (item) => item.name === 'count'
    )?.value;

    const pageId = pagesArray?.[page - 2];

    const start = pageParam && page !== 1 ? { id: pageId } : undefined;

    const items = await scan(
      client,
      table,
      pageParam ? start : undefined,
      projection ? [...projection, 'deleted'] : undefined,
      pageParam ? PAGE_SIZE : undefined
    );

    const finalItems = items.filter(
      (item) => !item.deleted && item.id !== 'count' && item.id !== 'pages'
    );

    const ascending = Boolean(asc);

    const body = {
      count: count ?? 0,
      items: sort
        ? // eslint-disable-next-line fp/no-mutating-methods
          finalItems.slice().sort((a, b) => {
            if (a[sort] > b[sort]) {
              return ascending ? -1 : 1;
            }
            return ascending ? 1 : -1;
          })
        : finalItems,
    };

    return returnOkResponse(body);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
