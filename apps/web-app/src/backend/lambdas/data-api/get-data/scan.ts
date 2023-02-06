import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const scan = async (
  client: DynamoDBDocumentClient,
  table: string,
  lastEvaludatedKey?: Record<string, unknown>,
  projection?: string[]
): Promise<Record<string, AttributeValue>[]> => {
  const key = lastEvaludatedKey
    ? {
        ExlusiveStartKey: lastEvaludatedKey,
      }
    : {};

  const projectionExpression = projection
    ? {
        ProjectionExpression: projection.join(', '),
      }
    : {};

  const command = new ScanCommand({
    TableName: process.env['DYNAMODB_TABLE'],
    ...key,
    ...projectionExpression,
  });

  const response = await client.send(command);

  if (response.LastEvaluatedKey) {
    return [
      ...(response?.Items ?? []),
      ...(await scan(client, table, response.LastEvaluatedKey, projection)),
    ];
  }

  return response?.Items ?? [];
};
