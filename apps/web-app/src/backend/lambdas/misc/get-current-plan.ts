import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { returnOkResponse } from '../data-api/return-ok-response';
import { StoredMealSelection, StoredPlan, GetPlanResponse } from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';

import { HttpError } from '../data-api/http-error';
import { doQuery } from '../dynamodb';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { groups } = await authoriseJwt(event);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const response = await doQuery(tableName, 'id = :id', ['plan']);

    if (!response.Items?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const plans = response.Items as StoredPlan[] | undefined;

    // eslint-disable-next-line fp/no-mutating-methods
    const plan = plans
      ?.slice()
      .sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1))?.[0];

    const { planId, menus, published, username, sort } = plan;

    const selectionResponse = await doQuery(tableName, `id = :id`, [
      `plan-${planId}-selection`,
    ]);

    if (!published && !groups.includes('admin')) {
      return returnOkResponse({ available: false });
    }

    const selections = selectionResponse.Items as
      | StoredMealSelection[]
      | undefined;

    const defaultResponse = {
      planId,
      cooks: menus,
      createdBy: username,
      date: sort,
      published,
    };

    const finalResponse: GetPlanResponse = groups.includes('admin')
      ? {
          ...defaultResponse,
          available: true,
          selections: selections.map((selection) => ({
            ...selection.selection,
            id: selection.id,
            sort: selection.sort,
          })),
        }
      : { ...defaultResponse, available: true };

    return returnOkResponse(finalResponse);
  } catch (error) {
    return returnErrorResponse(error);
  }
};
