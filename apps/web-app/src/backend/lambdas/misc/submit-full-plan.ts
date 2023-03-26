import './init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { chooseMealSelections } from '@tnmw/meal-planning';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import {
  StoredPlan,
  StoredMealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';
import { recursivelySerialiseDate, SerialisedDate } from '@tnmw/utils';

import { HTTP } from '@tnmw/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import { isWeeklyPlan } from '@tnmw/types';
import { batchArray } from '../../../utils/batch-array';
import { getUserFromAws } from '../../../utils/get-user-from-aws';
import { getAllUsers } from '../dynamodb/get-all-users';
import { batchWrite } from '../data-api/get-data/batch-write';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });

    const { username } = await authoriseJwt(event, ['admin']);
    const { firstName, surname } = await getUserFromAws(username);

    const payload = JSON.parse(event.body ?? '');

    if (!isWeeklyPlan(payload)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const list = await getAllUsers(
      process.env[ENV.varNames.CognitoPoolId] ?? ''
    );

    const cooks = payload.dates.map((date, index) => ({
      date: new Date(Date.parse(date)),
      menu: payload.cooks[index],
    }));

    const meals = chooseMealSelections(cooks, list, `${firstName} ${surname}`);

    const removeCancelled = meals.customerPlans.filter((plan) =>
      plan.deliveries.some((delivery) => {
        if (delivery.paused) {
          return true;
        }
        return delivery.plans.some((plan) => plan.status !== 'cancelled');
      })
    );

    const finalMeals = {
      ...meals,
      customerPlans: removeCancelled,
    };

    const planId = v4();

    const serialisedMeals = recursivelySerialiseDate(finalMeals);

    const selections: StoredMealPlanGeneratedForIndividualCustomer[] =
      finalMeals.customerPlans.map((customerPlan) => ({
        id: `plan-${planId}-selection`,
        sort: customerPlan.customer.username,
        ...customerPlan,
      }));

    const plan: SerialisedDate<StoredPlan> = {
      id: 'plan',
      sort: String(payload.timestamp),
      published: false,
      planId,
      username,
      createdBy: serialisedMeals.createdBy,
      createdOn: serialisedMeals.createdOn,
      menus: serialisedMeals.cooks,
      count: selections.length,
    };

    const batches = batchArray(
      [plan, ...recursivelySerialiseDate(selections)],
      25
    );
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    await Promise.all(
      batches.map(async (batch) => {
        const input: BatchWriteCommandInput = {
          RequestItems: {
            [tableName ?? '']: batch.map((item) => ({
              PutRequest: {
                Item: recursivelySerialiseDate(item),
              },
            })),
          },
        };

        await batchWrite(dynamo, input);
      })
    );

    return {
      statusCode: HTTP.statusCodes.Ok,
      body: '{}',
      headers: {
        [HTTP.headerNames.AccessControlAllowOrigin]: '*',
        [HTTP.headerNames.AccessControlAllowHeaders]: '*',
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return returnErrorResponse(error);
    }
    return returnErrorResponse();
  }
});
