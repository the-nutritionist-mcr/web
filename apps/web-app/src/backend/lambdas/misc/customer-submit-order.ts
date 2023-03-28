import './init-dd-trace';
import { returnErrorResponse } from '../data-api/return-error-response';
import { authoriseJwt } from '../data-api/authorise';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ORDERS_EMAIL } from '@tnmw/constants';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

import {
  CustomerMealsSelectionWithChargebeeCustomer,
  isSubmitCustomerOrderPayload,
} from '@tnmw/types';
import { HttpError } from '../data-api/http-error';
import { ENV, HTTP } from '@tnmw/constants';
import { makeEmail } from './submit-order-email-template';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    const { username: authedUsername } = await authoriseJwt(event);
    const marshallOptions = {
      removeUndefinedValues: true,
    };

    const dynamodbClient = new DynamoDBClient({});
    const ses = new SESClient({});
    const submitOrderData = JSON.parse(event.body ?? '');
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    if (!isSubmitCustomerOrderPayload(submitOrderData)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions,
    });

    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: `id = :id and sort = :sort`,
      ExpressionAttributeValues: {
        ':id': submitOrderData.plan,
        ':sort': submitOrderData.sort,
      },
    });

    const result = await dynamo.send(queryCommand);

    const selection: CustomerMealsSelectionWithChargebeeCustomer[number] =
      result.Items?.[0].selection;

    if (authedUsername !== selection.customer.id) {
      throw new HttpError(
        HTTP.statusCodes.Forbidden,
        'Tried to submit the order for a different customer. Nice try...'
      );
    }

    const newSelection: CustomerMealsSelectionWithChargebeeCustomer[number] = {
      customer: selection.customer,
      updatedByCustomer: true,
      deliveries: submitOrderData.deliveries,
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        id: submitOrderData.plan,
        sort: submitOrderData.sort,
        selection: newSelection,
      },
    });

    await dynamo.send(putCommand);

    const email: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [selection.customer.email],
        BccAddresses: [ORDERS_EMAIL],
      },
      Message: {
        Body: {
          Html: {
            // eslint-disable-next-line unicorn/text-encoding-identifier-case
            Charset: 'UTF-8',
            Data: makeEmail(
              selection.customer.firstName,
              submitOrderData.deliveries
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

    console.log(JSON.stringify(email, null, 2));

    const sendEmailCommand = new SendEmailCommand(email);

    await ses.send(sendEmailCommand);

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
