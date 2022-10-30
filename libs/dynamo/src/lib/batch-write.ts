import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

export const batchWrite = async (
  client: DynamoDBDocumentClient,
  input: BatchWriteCommandInput
) => {
  const command = new BatchWriteCommand(input);

  const response = await client.send(command);

  if (Object.keys(response.UnprocessedItems ?? {}).length > 0) {
    await new Promise((accept) => setTimeout(accept, 1000));
    await batchWrite(client, {
      RequestItems: response.UnprocessedItems,
    });
  }
};
