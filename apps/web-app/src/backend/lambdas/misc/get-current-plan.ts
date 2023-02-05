import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { returnOkResponse } from '../data-api/return-ok-response';
import {
  StoredPlan,
  GetPlanResponseNonAdmin,
  GetPlanResponseAdmin,
  StoredMealPlanGeneratedForIndividualCustomer,
  WeeklyCookPlanWithoutCustomerPlans,
} from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';

import { HttpError } from '../data-api/http-error';
import { doQuery } from '../dynamodb';
import { SerialisedDate } from '@tnmw/utils';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { groups, username: currentUser } = await authoriseJwt(event);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const response = await doQuery(tableName ?? '', 'id = :id', ['plan']);

    if (!response?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const plans = response as SerialisedDate<StoredPlan>[] | undefined;

    // eslint-disable-next-line fp/no-mutating-methods
    const plan = plans
      ?.slice()
      .sort((a, b) => (Number(a.sort) < Number(b.sort) ? 1 : -1))?.[0];

    if (!plan) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'A plan was not found in the database'
      );
    }

    const { planId, menus, published, createdBy, createdOn, sort } = plan;

    const selectionResponse = await doQuery(tableName ?? '', `id = :id`, [
      `plan-${planId}-selection`,
    ]);

    if (!published && !groups.includes('admin')) {
      return returnOkResponse({ available: false, admin: false });
    }

    const selections = selectionResponse as
      | SerialisedDate<StoredMealPlanGeneratedForIndividualCustomer>[];

    const currentUserSelection = selections?.find(
      (selection) => selection.customer?.username === currentUser
    );

    const thePlan = {
      cooks: menus,
      createdBy,
      createdOn,
    };

    type DefaultResponse = SerialisedDate<
      Omit<GetPlanResponseNonAdmin, 'available' | 'plan' | 'admin'> & {
        plan: WeeklyCookPlanWithoutCustomerPlans;
      }
    >;

    const defaultResponse: DefaultResponse = {
      planId,
      plan: thePlan,
      published,
      sort,
      currentUserSelection,
    };

    if (groups.includes('admin')) {
      const finalResponse: SerialisedDate<GetPlanResponseAdmin> = {
        ...defaultResponse,
        available: true,
        admin: true,
        plan: { ...defaultResponse.plan, customerPlans: selections },
      };
      return returnOkResponse(finalResponse);
    }

    const finalResponse: SerialisedDate<GetPlanResponseNonAdmin> = {
      ...defaultResponse,
      available: true,
      admin: false,
    };

    return returnOkResponse(finalResponse);
  } catch (error) {
    return returnErrorResponse(error);
  }
});
