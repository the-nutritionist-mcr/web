import './init-dd-trace';
import { returnErrorResponse } from '../data-api/return-error-response';
import { authoriseJwt } from '../data-api/authorise';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  CustomerMealsSelectionWithChargebeeCustomer,
  isChangePlanRecipeBody,
} from '@tnmw/types';
import { HttpError } from '../data-api/http-error';
import { ENV, HTTP } from '@tnmw/constants';
import { updateDelivery } from '@tnmw/utils';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const marshallOptions = {
      removeUndefinedValues: true,
    };

    const dynamodbClient = new DynamoDBClient({});
    const changePlanData = JSON.parse(event.body ?? '');
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    if (!isChangePlanRecipeBody(changePlanData)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions,
    });

    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: `id = :id and sort = :sort`,
      ExpressionAttributeValues: {
        ':id': changePlanData.selectionId,
        ':sort': changePlanData.selectionSort,
      },
    });

    const result = await dynamo.send(queryCommand);

    const selection: CustomerMealsSelectionWithChargebeeCustomer[number] =
      result.Items?.[0].selection;

    const newSelection: CustomerMealsSelectionWithChargebeeCustomer[number] = {
      customer: selection.customer,
      deliveries: updateDelivery(selection.deliveries, changePlanData),
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        id: changePlanData.selectionId,
        sort: changePlanData.selectionSort,
        selection: newSelection,
      },
    });

    await dynamo.send(putCommand);

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
