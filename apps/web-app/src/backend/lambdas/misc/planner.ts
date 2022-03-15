import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Recipe, isRecipe, Customer } from '@tnmw/types';
import { chooseMeals } from '@tnmw/meal-planning';
import { ENV } from '@tnmw/constants';
import { authoriseJwt } from '../data-api/authorise';
import { StoredPlan } from '@tnmw/types';
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

const parseCustomerList = (output: ListUsersCommandOutput): Customer[] => {
  return [];
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

    const response = parseCustomerList(await cognito.send(command));

    const meals = chooseMeals(payload.cooks, dates, response);

    const item: StoredPlan = {
      timestamp: Date.now(),
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
  } catch (error) {
    return returnErrorResponse(error);
  }
};
