import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { createQueryParams } from './create-query-params';

export const doQuery = async <T extends Record<string, unknown>>(
  tableName: string,
  query: string,
  values: string[],
  lastEvaluatedKey?: Record<string, unknown>
): Promise<T[]> => {
  const dynamodbClient = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(dynamodbClient);
  const pageKey = lastEvaluatedKey
    ? { ExclusiveStartKey: JSON.parse(lastEvaluatedKey) }
    : {};
  const input = {
    TableName: tableName,
    ...createQueryParams(query, ...values),
    ...pageKey,
  };

  const response = await dynamo.send(new QueryCommand(input));

  if (response.LastEvaluatedKey) {
    return [
      response.Items,
      ...(await doQuery(tableName, query, values, response.LastEvaluatedKey)),
    ] as T[];
  }

  return response.Items as T[];
};
