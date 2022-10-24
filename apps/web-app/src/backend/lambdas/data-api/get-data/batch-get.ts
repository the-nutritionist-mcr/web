import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

export const batchGet = async (
  client: DynamoDBDocumentClient,
  input: BatchGetCommandInput
): Promise<BatchGetCommandOutput> => {
  const command = new BatchGetCommand(input);

  const response = await client.send(command);

  if (Object.keys(response.UnprocessedKeys ?? {}).length > 0) {
    const nextResponse = await batchGet(client, {
      RequestItems: response.UnprocessedKeys,
    });

    return {
      Responses: Object.fromEntries(
        Object.entries(response.Responses ?? {}).map(([key, value]) => {
          return [key, [...value, ...(nextResponse.Responses?.[key] ?? [])]];
        })
      ),
      ...response,
    };
  }

  return response;
};
