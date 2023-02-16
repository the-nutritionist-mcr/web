import { returnErrorResponse } from '../data-api/return-error-response';
import { authoriseJwt } from '../data-api/authorise';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { performSwaps } from '@tnmw/meal-planning';
import {
  assertsMealSelectPayload,
  Recipe,
  StoredMealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import { ENV, HTTP, ORDERS_EMAIL } from '@tnmw/constants';
import { HttpError } from '../data-api/http-error';
import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
import { makeEmail } from './submit-order-email-template';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { groups, username } = await authoriseJwt(event);
    const marshallOptions = {
      removeUndefinedValues: true,
    };
    const ses = new SESClient({});

    const dynamodbClient = new DynamoDBClient({});
    const payload = JSON.parse(event.body ?? '');
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    assertsMealSelectPayload(payload);

    if (
      !groups.includes('admin') &&
      username !== payload.selection.customer.username
    ) {
      throw new HttpError(HTTP.statusCodes.Forbidden, 'nice try...');
    }
    const environment = process.env[ENV.varNames.EnvironmentName];

    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions,
    });

    /**
     * There is a bug here that the application now kind of depends on
     * Selection contains 'id' because it is pulled from the database - this
     * is overwriting the previous id in the spread. LOL.
     */
    const selection: StoredMealPlanGeneratedForIndividualCustomer = {
      id: `plan-${payload.id}-selection`,
      sort: payload.selection.customer.username,
      ...payload.selection,
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: selection,
    });

    await dynamo.send(putCommand);

    if (payload.selection.wasUpdatedByCustomer) {
      const command = new ScanCommand({
        TableName: process.env[ENV.varNames.RecipesDynamoDBTable],
      });

      const { Items: items } = await dynamo.send(command);

      const recipes = items as Recipe[];

      const bcc = environment === 'prod' ? [ORDERS_EMAIL] : [];

      const email: SendEmailCommandInput = {
        Destination: {
          ToAddresses: [selection.customer.email],
          BccAddresses: bcc,
        },
        Message: {
          Body: {
            Html: {
              // eslint-disable-next-line unicorn/text-encoding-identifier-case
              Charset: 'UTF-8',
              Data: makeEmail(
                selection.customer.firstName,
                performSwaps(selection, selection.customer, recipes)
              ),
            },
          },
          Subject: {
            // eslint-disable-next-line unicorn/text-encoding-identifier-case
            Charset: 'UTF-8',
            Data: 'Your Meal Choices',
          },
        },
        Source: 'no-reply@thenutritionistmcr.com',
      };

      const sendEmailCommand = new SendEmailCommand(email);

      await ses.send(sendEmailCommand);
    }

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
});
