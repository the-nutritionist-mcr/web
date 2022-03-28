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

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // await authoriseJwt(event, ['admin']);

    const dynamodbClient = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

    const tableName = process.env[ENV.varNames.DynamoDBTable];

    const input: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: `#id = :id`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': 'plan',
      },
    };

    const response = await dynamo.send(new QueryCommand(input));

    if (!response.Items?.length) {
      throw new HttpError(
        HTTP.statusCodes.InternalServerError,
        'Dynamodb did not return a response'
      );
    }

    const plans = response.Items as StoredPlan[] | undefined;

    const plan = plans
      ?.slice()
      .sort((a, b) => (Number(a.sort) > Number(b.sort) ? 1 : -1))?.[0];

    const { planId } = plan;

    const selectionQueryInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: `#id = :id`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': `plan-${planId}-selection`,
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
