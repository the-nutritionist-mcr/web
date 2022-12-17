import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { writeData } from './write-data';
import { deleteAll } from './delete-all';

export const seedDynamodb = async (
  table: string,
  data: Record<string, unknown>[]
) => {
  const dynamodbClient = new DynamoDBClient({});
  const client = DynamoDBDocumentClient.from(dynamodbClient, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });
  await deleteAll(client, table);
  await writeData(client, table, data);
};
