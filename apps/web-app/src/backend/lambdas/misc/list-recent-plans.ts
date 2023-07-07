import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { returnOkResponse } from '../data-api/return-ok-response';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';

import { HttpError } from '../data-api/http-error';
import { doQuery } from '../dynamodb';
import { warmer } from './warmer';

const MAX_PLANS = 20;

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const response = await doQuery(
      tableName ?? '',
      'id = :id',
      ['plan'],
      { Limit: MAX_PLANS, ScanIndexForward: false },
      1
    );

    if (!response?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const finalResponse = response.map(({ createdOn, sort }) => ({
      createdOn,
      sort,
    }));

    return returnOkResponse(finalResponse);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
