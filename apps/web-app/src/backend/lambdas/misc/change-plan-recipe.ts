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
  isRecipe,
  Recipe,
} from '@tnmw/types';
import { HttpError } from '../data-api/http-error';
import { ENV, HTTP } from '@tnmw/constants';

export interface ChangePlanRecipeBody {
  recipe: Recipe;
  selectionId: string;
  selectionSort: string;
  deliveryIndex: number;
  itemIndex: number;
}

const isChangePlanRecipeBody = (
  body: unknown
): body is ChangePlanRecipeBody => {
  const bodyAsAny = body as any;

  if (!isRecipe(bodyAsAny.recipe)) {
    return false;
  }

  if (typeof bodyAsAny.selectionId !== 'string') {
    return false;
  }

  if (typeof bodyAsAny.deliveryIndex !== 'number') {
    return false;
  }

  if (typeof bodyAsAny.itemIndex !== 'number') {
    return false;
  }

  return true;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    await authoriseJwt(event, ['admin']);
    const dynamodbClient = new DynamoDBClient({});
    const changePlanData = JSON.parse(event.body);
    const tableName = process.env[ENV.varNames.DynamoDBTable];

    if (!isChangePlanRecipeBody(changePlanData)) {
      throw new HttpError(HTTP.statusCodes.BadRequest, 'Request was invalid');
    }

    const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: `id = :id and sort = :sort`,
      ExpressionAttributeValues: {
        ':id': changePlanData.selectionId,
        ':sort': changePlanData.selectionSort,
      },
    });

    const result = await dynamo.send(queryCommand);

    const selections: CustomerMealsSelectionWithChargebeeCustomer = JSON.parse(
      result.Items[0].selection
    );

    const newSelections = selections.map((delivery, index) =>
      index !== changePlanData.deliveryIndex
        ? delivery
        : {
            ...delivery,
            deliveries: delivery.deliveries.map((item, itemIndex) =>
              itemIndex !== changePlanData.itemIndex
                ? item
                : changePlanData.recipe
            ),
          }
    );

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        id: changePlanData.selectionId,
        sort: changePlanData.selectionSort,
        selection: newSelections,
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
};
