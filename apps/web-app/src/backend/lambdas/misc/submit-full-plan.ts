import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Customer, CustomerPlan, PlanLabels, DaysPerWeek } from '@tnmw/types';
import { chooseMeals, makeNewPlan } from '@tnmw/meal-planning';
import { COGNITO, ENV } from '@tnmw/constants';
import { defaultDeliveryDays, planLabels, extrasLabels } from '@tnmw/config';
import { authoriseJwt } from '../data-api/authorise';
import { StoredPlan, StandardPlan } from '@tnmw/types';
import { returnErrorResponse } from '../data-api/return-error-response';
import { HttpError } from '../data-api/http-error';

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
  ListUsersCommandOutput,
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

const getAttributeValue = (
  attributes: ListUsersCommandOutput['Users'][number]['Attributes'],
  key: string
): string | undefined =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

const getJsonAttributeValue = <T>(
  attributes: ListUsersCommandOutput['Users'][number]['Attributes'],
  key: string,
  defaultValue: T
) => {
  try {
    const rawValue = getAttributeValue(attributes, key);

    return JSON.parse(rawValue);
  } catch {
    return defaultValue;
  }
};

const convertPlanFormat = (
  plans: StandardPlan[]
): Omit<CustomerPlan, 'configuration'> =>
  plans
    .map((plan) =>
      makeNewPlan(
        {
          defaultDeliveryDays,
          planLabels: [...planLabels],
          extrasLabels: [...extrasLabels],
        },
        {
          planType: plan.name as PlanLabels,
          daysPerWeek: plan.daysPerWeek as DaysPerWeek,
          mealsPerDay: plan.itemsPerDay,
        }
      )
    )
    .reduce<Omit<CustomerPlan, 'configuration'>>(
      (accum, item) => ({
        deliveries: accum.deliveries.map((delivery, index) => ({
          // eslint-disable-next-line security/detect-object-injection
          items: delivery.items.concat(item.deliveries[index].items),
          extras: [],
        })),
      }),
      {
        deliveries: [],
      }
    );

const parseCustomerList = (
  output: ListUsersCommandOutput
): Omit<Customer, 'plan' | 'snack' | 'breakfast' | 'daysPerWeek'>[] => {
  return output.Users.map((user) => ({
    exclusions: getJsonAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.UserCustomisations}`,
      []
    ),
    newPlan: convertPlanFormat(
      getJsonAttributeValue(
        user.Attributes,
        `custom:${COGNITO.customAttributes.Plans}`,
        []
      )
    ) as CustomerPlan,
    id: user.Username,
    salutation: getAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.Salutation}`
    ),
    firstName: getAttributeValue(
      user.Attributes,
      COGNITO.standardAttributes.firstName
    ),
    surname: getAttributeValue(
      user.Attributes,
      COGNITO.standardAttributes.surname
    ),
    address: [
      getAttributeValue(
        user.Attributes,
        `custom:${COGNITO.customAttributes.AddressLine1}`
      ),
      getAttributeValue(
        user.Attributes,
        `custom:${COGNITO.customAttributes.AddressLine2}`
      ),
    ].join('\n'),
    email: getAttributeValue(user.Attributes, COGNITO.standardAttributes.email),
    addressLine3: getAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine3}`
    ),
    telephone: getAttributeValue(
      user.Attributes,
      COGNITO.standardAttributes.phone
    ),
  }));
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const cognito = new CognitoIdentityProviderClient({});
    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

    const { username } = await authoriseJwt(event, ['admin']);

    const payload = JSON.parse(event.body);

    if (!isWeeklyPlan(payload)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const dates = payload.dates.map((date) => new Date(Date.parse(date)));

    const input: ListUsersCommandInput = {
      UserPoolId: process.env[ENV.varNames.CognitoPoolId],
    };

    const command = new ListUsersCommand(input);
    const customers = parseCustomerList(await cognito.send(command));
    const meals = chooseMeals(payload.cooks, dates, customers);

    const planTimestamp = String(Date.now());
    const planId = v4();

    const plan: StoredPlan = {
      id: 'plan',
      sort: planTimestamp,
      planId,
      menus: dates.map((date, index) => ({
        date: date.toString(),
        // eslint-disable-next-line security/detect-object-injection
        menu: payload.cooks[index],
      })),
      username,
    };

    const selections: StoredMealSelection[] = meals.map((meal) => ({
      id: `selection`,
      sort: `plan-${planId}`,
      selectionId: v4(),
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
