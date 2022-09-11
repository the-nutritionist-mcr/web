import { exclusions } from './exclusions-data';
import { recipes } from './recipes-data';

import {
  BatchWriteCommandInput,
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const batchArray = <T>(input: T[], batchSize: number): T[][] =>
  input.reduce<T[][]>(
    (accumulator, item) =>
      accumulator[accumulator.length - 1].length === batchSize
        ? [...accumulator, [item]]
        : [
            ...accumulator.slice(0, -1),
            [...accumulator[accumulator.length - 1], item],
          ],
    [[]]
  );

const exclusionsTable = 'tnm-web-customisation-table-prod';
const recipesTable = 'tnm-web-recipe-table-prod';

const run = async () => {
  const dynamodbClient = new DynamoDBClient({
    region: 'eu-west-2',
  });

  const dynamo = DynamoDBDocumentClient.from(dynamodbClient, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  const exclusionsToWrite = batchArray(exclusions, 25);

  await Promise.all(
    exclusionsToWrite.map(async (batch) => {
      const input: BatchWriteCommandInput = {
        RequestItems: {
          [exclusionsTable]: batch.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      };

      const batchWriteCommand = new BatchWriteCommand(input);
      await dynamo.send(batchWriteCommand);
    })
  );

  const recipesToWrite = batchArray(recipes, 25);

  await Promise.all(
    recipesToWrite.map(async (batch) => {
      const input: BatchWriteCommandInput = {
        RequestItems: {
          [recipesTable]: batch.map((item) => ({ PutRequest: { Item: item } })),
        },
      };

      const batchWriteCommand = new BatchWriteCommand(input);
      await dynamo.send(batchWriteCommand);
    })
  );
};

run().catch((error) => console.log(error));
