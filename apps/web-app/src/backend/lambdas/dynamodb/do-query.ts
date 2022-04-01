import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { createQueryParams } from './create-query-params';

export const doQuery = async (
  tableName: string,
  query: string,
  values: string[]
) => {
  const dynamodbClient = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(dynamodbClient);
  const input = {
    TableName: tableName,
    ...createQueryParams(query, ...values),
  };

  return await dynamo.send(new QueryCommand(input));
};
