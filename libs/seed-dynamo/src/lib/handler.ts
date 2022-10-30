import { CdkCustomResourceHandler } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import {
  SEED_DATA_BUCKET_KEY_STRING,
  SEED_DATA_FILE_NAME,
  TABLE_KEY_STRING,
} from './constants';
import { deleteAll } from './delete-all';
import { writeData } from './write-data';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const handler: CdkCustomResourceHandler = async (event) => {
  const s3 = new S3Client({});

  const command = new GetObjectCommand({
    Bucket: process.env[SEED_DATA_BUCKET_KEY_STRING],
    Key: SEED_DATA_FILE_NAME,
  });

  const response = await s3.send(command);

  const data: Record<string, unknown>[] = JSON.parse(
    (await response.Body?.transformToString()) ?? '[]'
  );

  if (event.RequestType === 'Update' || event.RequestType === 'Create') {
    const dynamodbClient = new DynamoDBClient({});
    const client = DynamoDBDocumentClient.from(dynamodbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
    const table = process.env[TABLE_KEY_STRING] ?? '';
    await deleteAll(client, table);
    await writeData(client, table, data);
  }

  return {};
};
