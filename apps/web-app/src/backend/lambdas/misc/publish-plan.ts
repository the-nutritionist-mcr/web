import './init-dd-trace';
import { returnErrorResponse } from '../data-api/return-error-response';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'; // ES6 import
import { ENV, HTTP } from '@tnmw/constants';
import { HttpError } from '../data-api/http-error';
import { isPublishPlanBody } from '@tnmw/types';
import { authoriseJwt } from '../data-api/authorise';
import { returnOkResponse } from '../data-api/return-ok-response';
import { warmer } from './warmer';

export const handler = warmer<APIGatewayProxyHandlerV2>(async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const dynamodbClient = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodbClient); // client is DynamoDB client

    const publishPlanBody = JSON.parse(event.body ?? '');
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    if (!isPublishPlanBody(publishPlanBody)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        id: publishPlanBody.id,
        sort: publishPlanBody.sort,
      },
      UpdateExpression: `SET published = :published`,
      ExpressionAttributeValues: {
        ':published': true,
      },
    });

    await client.send(updateCommand);
    return returnOkResponse({});
  } catch (error) {
    return returnErrorResponse(error);
  }
});
