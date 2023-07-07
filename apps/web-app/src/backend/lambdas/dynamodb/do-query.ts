import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { createQueryParams } from './create-query-params';

export const doQueryRecursive = async <T extends Record<string, unknown>>(
  input: QueryCommandInput,
  lastEvaluatedKey?: Record<string, unknown>,
  pages?: number
): Promise<T[]> => {
  if (pages === 0) {
    return [];
  }
  const dynamodbClient = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(dynamodbClient);

  const pagedInput = lastEvaluatedKey
    ? {
        ...input,
        ExclusiveStartKey: lastEvaluatedKey,
      }
    : input;

  console.log(JSON.stringify(pagedInput, null, 2));

  const response = await dynamo.send(new QueryCommand(pagedInput));

  if (response.LastEvaluatedKey) {
    return [
      ...(response.Items ?? []),
      ...(await doQueryRecursive(
        input,
        response.LastEvaluatedKey,
        pages ? pages - 1 : pages
      )),
    ] as T[];
  }

  return response.Items as T[];
};

export const doQuery = async <T extends Record<string, unknown>>(
  tableName: string,
  query: string,
  values: string[],
  otherInput?: Partial<QueryCommandInput>,
  pages?: number
): Promise<T[]> => {
  const input: QueryCommandInput = {
    TableName: tableName,
    ...createQueryParams(query, ...values),
    ...otherInput,
  };
  return await doQueryRecursive(input, undefined, pages);
};
