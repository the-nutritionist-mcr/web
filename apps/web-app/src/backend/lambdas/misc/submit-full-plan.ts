import './init-dd-trace';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { chooseMeals } from '@tnmw/meal-planning';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { parseCustomerList } from '../../../utils/parse-customer-list';
import { StoredPlan } from '@tnmw/types';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';
import { isActive } from '@tnmw/utils';

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
import { StoredMealSelection } from '@tnmw/types';
import { batchArray } from '../../../utils/batch-array';
import { convertPlanFormat } from '@tnmw/utils';
import { itemFamilies } from '@tnmw/config';
import { hydrateCustomPlan } from './hydrate-custom-plan';

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

    const dates = payload.dates.map((date) => new Date(Date.parse(date)));

    const input: ListUsersCommandInput = {
      UserPoolId: process.env[ENV.varNames.CognitoPoolId],
    };

    const command = new ListUsersCommand(input);

    const list = parseCustomerList(await cognito.send(command)).map((item) => {
      const mealsForPlan = item.customPlan
        ? { deliveries: hydrateCustomPlan(item.customPlan, itemFamilies) }
        : convertPlanFormat(item.plans, itemFamilies);

      const mealsForPlanWithPausedRemoved = {
        deliveries: mealsForPlan.deliveries.map((delivery, index) => {
          const active = isActive(dates[index], item.plans);

          return active ? delivery : { items: [], extras: [] };
        }),
      };

      return {
        ...item,
        newPlan: mealsForPlanWithPausedRemoved,
        address: '',
        telephone: '',
        exclusions: item.customisations,
        chargebeePlan: item.plans,
      };
    });

    const meals = chooseMeals(payload.cooks, dates, list);

    const planId = v4();

    const plan: StoredPlan = {
      id: 'plan',
      sort: String(payload.timestamp),
      published: false,
      planId,
      menus: dates.map((date, index) => ({
        date: date.toString(),
        // eslint-disable-next-line security/detect-object-injection
        menu: payload.cooks[index],
      })),
      username,
      createdByName: `${firstName} ${surname}`,
    };

    const selections: StoredMealSelection[] = meals.map((meal) => ({
      id: `plan-${planId}-selection`,
      sort: v4(),
      selection: meal,
    }));

    const batches = batchArray([plan, ...selections], 25);
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    await Promise.all(
      batches.map(async (batch) => {
        const input: BatchWriteCommandInput = {
          RequestItems: {
            [tableName]: batch.map((item) => ({ PutRequest: { Item: item } })),
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
