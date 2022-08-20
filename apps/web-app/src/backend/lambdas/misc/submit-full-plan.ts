import './init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { chooseMeals, chooseMealSelections } from '@tnmw/meal-planning';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { parseCustomerList } from '../../../utils/parse-customer-list';
import {
  StoredPlan,
  StoredMealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';
import { recursivelySerialiseDate, SerialisedDate } from '@tnmw/utils';

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

import { HTTP } from '@tnmw/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommandInput,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import { isWeeklyPlan } from '@tnmw/types';
import { batchArray } from '../../../utils/batch-array';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const cognito = new CognitoIdentityProviderClient({});
    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });

    const { username, firstName, surname } = await authoriseJwt(event, [
      'admin',
    ]);

    const payload = JSON.parse(event.body);

    if (!isWeeklyPlan(payload)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const input: ListUsersCommandInput = {
      UserPoolId: process.env[ENV.varNames.CognitoPoolId],
    };

    const command = new ListUsersCommand(input);

    const list = parseCustomerList(await cognito.send(command));

    const cooks = payload.dates.map((date, index) => ({
      date: new Date(Date.parse(date)),
      menu: payload.cooks[index],
    }));

    const meals = chooseMealSelections(cooks, list, `${firstName} ${surname}`);

    const planId = v4();

    const serialisedMeals = recursivelySerialiseDate(meals);

    const plan: SerialisedDate<StoredPlan> = {
      id: 'plan',
      sort: String(payload.timestamp),
      published: false,
      planId,
      username,
      createdBy: serialisedMeals.createdBy,
      createdOn: serialisedMeals.createdOn,
      menus: serialisedMeals.cooks,
    };

    const selections: StoredMealPlanGeneratedForIndividualCustomer[] =
      meals.customerPlans.map((customerPlan) => ({
        id: `plan-${planId}-selection`,
        sort: customerPlan.customer.username,
        ...customerPlan,
      }));

    const batches = batchArray(
      [plan, ...recursivelySerialiseDate(selections)],
      25
    );
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    await Promise.all(
      batches.map(async (batch) => {
        const input: BatchWriteCommandInput = {
          RequestItems: {
            [tableName]: batch.map((item) => ({
              PutRequest: {
                Item: recursivelySerialiseDate(item),
              },
            })),
          },
        };

        const batchWriteCommand = new BatchWriteCommand(input);
        await dynamo.send(batchWriteCommand);
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
    return returnErrorResponse(error);
  }
};
