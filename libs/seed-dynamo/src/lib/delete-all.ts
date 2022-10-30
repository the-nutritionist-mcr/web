import {
  BatchWriteCommandInput,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { batchWrite, scan } from '@tnmw/dynamo';
import { batchArray } from '@tnmw/utils';

export const deleteAll = async (
  client: DynamoDBDocumentClient,
  table: string
) => {
  const data = await scan(client, table);

  const keys = data.map((item) => item.id);

  const batches = batchArray(keys, 25);

  await Promise.all(
    batches.map(async (batch) => {
      const input: BatchWriteCommandInput = {
        RequestItems: {
          [table]: batch.map((item) => ({
            DeleteRequest: {
              Key: {
                id: item,
              },
            },
          })),
        },
      };

      await batchWrite(client, input);
    })
  );
};
