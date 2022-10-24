import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { createQueryParams } from './create-query-params';

export const doQueryRecursive = async <T extends Record<string, unknown>>(
  input: QueryCommandInput,
  lastEvaluatedKey?: Record<string, unknown>
): Promise<T[]> => {
  const dynamodbClient = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

  const pagedInput = lastEvaluatedKey
    ? {
        ...input,
        ExclusiveStartKey: lastEvaluatedKey,
      }
    : input;

  const response = await dynamo.send(new QueryCommand(pagedInput));

  if (response.LastEvaluatedKey) {
    return [
      ...(response.Items ?? []),
      ...(await doQueryRecursive(input, response.LastEvaluatedKey)),
    ] as T[];
  }

  return response.Items as T[];
};

export const doQuery = async <T extends Record<string, unknown>>(
  tableName: string,
  query: string,
  values: string[]
): Promise<T[]> => {
  const input: QueryCommandInput = {
    TableName: tableName,
    ...createQueryParams(query, ...values),
  };
  return await doQueryRecursive(input);
};
