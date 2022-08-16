import './init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { chooseMeals, chooseMealSelections } from '@tnmw/meal-planning';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { parseCustomerList } from '../../../utils/parse-customer-list';
import { StoredPlan } from '@tnmw/types';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';
import {
  isActive,
  recursivelyDeserialiseDate,
  recursivelySerialiseDate,
} from '@tnmw/utils';

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
import { StoredMealPlanGeneratedForIndividualCustomer } from 'libs/types/src/lib/meal-plan';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const cognito = new CognitoIdentityProviderClient({});
    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });

    console.log('one');

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
    console.log('two');

    const cooks = payload.dates.map((date, index) => ({
      date: new Date(Date.parse(date)),
      menu: payload.cooks[index],
    }));

    console.log('three');
    const meals = chooseMealSelections(cooks, list, `${firstName} ${surname}`);
    console.log('four');

    const planId = v4();

    const plan: StoredPlan = {
      id: 'plan',
      sort: String(payload.timestamp),
      published: false,
      planId,
      username,
      createdBy: meals.createdBy,
      createdOn: meals.createdOn.toString(),
      menus: meals.cooks,
    };

    console.log('five');
    const selections: StoredMealPlanGeneratedForIndividualCustomer[] =
      meals.customerPlans.map((customerPlan) => ({
        id: `plan-${planId}-selection`,
        sort: v4(),
        ...customerPlan,
      }));

    const batches = batchArray([plan, ...selections], 25);
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    await Promise.all(
      batches.map(async (batch, index) => {
        console.log(`six-${index}`);
        const input: BatchWriteCommandInput = {
          RequestItems: {
            [tableName]: batch.map((item) => ({
              PutRequest: {
                Item: recursivelySerialiseDate(
                  item as unknown as Record<string, unknown>
                ),
              },
            })),
          },
        };

        console.log(JSON.stringify(input, null, 2));

        const batchWriteCommand = new BatchWriteCommand(input);
        await dynamo.send(batchWriteCommand);
        console.log(`six-a-${index}`);
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
