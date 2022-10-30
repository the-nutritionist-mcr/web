import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const scan = async (
  client: DynamoDBDocumentClient,
  table: string,
  lastEvaludatedKey?: Record<string, unknown>
): Promise<Record<string, AttributeValue>[]> => {
  const key = lastEvaludatedKey
    ? {
        ExlusiveStartKey: lastEvaludatedKey,
      }
    : {};

  const command = new ScanCommand({
    TableName: table,
    ...key,
  });

  const response = await client.send(command);

  if (response.LastEvaluatedKey) {
    return [
      ...(response?.Items ?? []),
      ...(await scan(client, table, response.LastEvaluatedKey)),
    ];
  }

  return response?.Items ?? [];
};
