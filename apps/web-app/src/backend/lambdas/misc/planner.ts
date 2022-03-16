import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  Recipe,
  isRecipe,
  Customer,
  CustomerPlan,
  PlanLabels,
  DaysPerWeek,
} from '@tnmw/types';
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
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';

interface WeeklyPlan {
  cooks: Recipe[][];
  dates: string[];
}

const isWeeklyPlan = (plan: unknown): plan is WeeklyPlan => {
  if (typeof plan !== 'object') {
    return false;
  }

  const asPlan = plan as WeeklyPlan;

  return (
    Array.isArray(asPlan.cooks) &&
    asPlan.cooks.every(
      (item) => Array.isArray(item) && item.every((recipe) => isRecipe(recipe))
    ) &&
    typeof asPlan.dates === 'string'
  );
};

const getAttributeValue = (
  attributes: ListUsersCommandOutput['Users'][number]['Attributes'],
  key: string
): string | undefined =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

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
    exclusions: JSON.parse(
      getAttributeValue(
        user.Attributes,
        `custom:${COGNITO.customAttributes.UserCustomisations}`
      )
    ),
    newPlan:
      getAttributeValue(
        user.Attributes,
        `custom:${COGNITO.customAttributes.Plans}`
      ) &&
      (convertPlanFormat(
        JSON.parse(
          getAttributeValue(
            user.Attributes,
            `custom:${COGNITO.customAttributes.Plans}`
          )
        )
      ) as CustomerPlan),
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

    const item: StoredPlan = {
      timestamp: new Date(Date.now()),
      selections: meals,
      menus: dates.map((date, index) => ({ date, menu: payload.cooks[index] })),
      username,
      id: v4(),
    };

    const putCommand = new PutCommand({
      TableName: process.env[ENV.varNames.DynamoDBTable],
      Item: item,
    });

    await dynamo.send(putCommand);
    return {
      statusCode: HTTP.statusCodes.Ok,
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
