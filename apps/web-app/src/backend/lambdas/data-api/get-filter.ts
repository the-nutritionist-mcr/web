import '../misc/init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';

import { returnErrorResponse } from './return-error-response';
import { scan } from './get-data/scan';
import { returnOkResponse } from './return-ok-response';
import Fuse from 'fuse.js';
import { warmer } from '../misc/warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const searchTerm = event.queryStringParameters?.searchTerm;

    const dynamodb = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodb);

    const items = await scan(client, process.env['DYNAMODB_TABLE'] ?? '');

    const withoutDeleted = items.filter((item) => !item.deleted);

    const fuse = new Fuse(withoutDeleted, {
      keys: ['name', 'shortName', 'description'],
    });

    const body = {
      items: searchTerm
        ? fuse.search(searchTerm).map((result) => result.item)
        : withoutDeleted,
    };

    return returnOkResponse(body);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
