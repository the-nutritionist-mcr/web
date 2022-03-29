import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { StoredPlan } from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';

import { HttpError } from '../data-api/http-error';
import { doQuery } from '../create-query-params';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const response = await doQuery(tableName, 'id = #id', ['plan']);

    if (!response.Items?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const plans = response.Items as StoredPlan[] | undefined;

    const plan = plans
      ?.slice()
      .sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1))?.[0];

    const { planId } = plan;

    const selectionResponse = await doQuery(tableName, `id = #id`, [
      `plan-${planId}-selection`,
    ]);
    return {
      statusCode: HTTP.statusCodes.Ok,
      body: JSON.stringify(selectionResponse.Items),
      headers: {
        [HTTP.headerNames.AccessControlAllowOrigin]: '*',
        [HTTP.headerNames.AccessControlAllowHeaders]: '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
