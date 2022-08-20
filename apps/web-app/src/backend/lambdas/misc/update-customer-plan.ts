import { returnErrorResponse } from '../data-api/return-error-response';
import { authoriseJwt } from '../data-api/authorise';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  assertsMealSelectPayload,
  StoredMealPlanGeneratedForIndividualCustomer,
} from '@tnmw/types';
import { ENV, HTTP } from '@tnmw/constants';
import { HttpError } from '../data-api/http-error';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { groups, username } = await authoriseJwt(event, ['admin']);
    const marshallOptions = {
      removeUndefinedValues: true,
    };

    const dynamodbClient = new DynamoDBClient({});
    const payload = JSON.parse(event.body);
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    assertsMealSelectPayload(payload);

    if (
      !groups.includes('admin') &&
      username !== payload.selection.customer.username
    ) {
      throw new HttpError(HTTP.statusCodes.Forbidden, 'nice try...');
    }

    const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions,
    });

    const selection: StoredMealPlanGeneratedForIndividualCustomer = {
      id: payload.id,
      sort: payload.selection.customer.username,
      ...payload.selection,
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: selection,
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
};
