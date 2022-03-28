import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { returnErrorResponse } from '../data-api/return-error-response';
import { StoredPlan } from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
// import { authoriseJwt } from '../data-api/authorise';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommandInput,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { HttpError } from '../data-api/http-error';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_MINUTE = 60;
const MS_IN_SECOND = 1000;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // await authoriseJwt(event, ['admin']);

    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const ONE_MONTH_AGO =
      Math.floor(Date.now() / MS_IN_SECOND) *
      MINUTES_IN_HOUR *
      SECONDS_IN_MINUTE *
      HOURS_IN_DAY *
      30;

    const input: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: `#id = :id`,
      ExpressionAttributeNames: {
        '#id': 'id',
        '#sort': 'sort',
      },
      ExpressionAttributeValues: {
        ':id': 'plan',
      },
      FilterExpression: `#sort GE ${ONE_MONTH_AGO}`,
    };

    const response = await dynamo.send(new QueryCommand(input));

    if (!response.Items?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const plan = response.Items[0] as StoredPlan;
    const { planId } = plan;

    const selectionQueryInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: `#id = :id`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': planId,
      },
    };
    const selectionResponse = await dynamo.send(
      new QueryCommand(selectionQueryInput)
    );
    return {
      statusCode: HTTP.statusCodes.Ok,
      body: JSON.stringify(selectionResponse.Items),
      headers: {
        [HTTP.headerNames.AccessControlAllowOrigin]: '*',
        [HTTP.headerNames.AccessControlAllowHeaders]: '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
