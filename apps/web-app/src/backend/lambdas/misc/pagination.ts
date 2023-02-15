import { DynamoDBStreamHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { scan } from '@tnmw/dynamo';
import { PAGE_SIZE } from '@tnmw/constants';

export const handler: DynamoDBStreamHandler = async (event) => {
  const dynamodb = new DynamoDBClient({});

  const client = DynamoDBDocumentClient.from(dynamodb);

  await event.Records?.reduce(async (previous, record) => {
    await previous;
    const { eventName } = record;
    if (
      eventName === 'INSERT' ||
      eventName === 'REMOVE' ||
      eventName === 'MODIFY'
    ) {
      const keys = await scan(
        client,
        process.env['DYNAMODB_TABLE'] ?? '',
        undefined,
        ['id', 'deleted']
      );

      const dataItems = keys
        .filter((key) => !key.deleted)
        .map((key) => key.id)
        .filter((key) => key !== 'count' && key !== 'pages');

      const pages = dataItems.filter(
        (_, index) => (index + 1) % PAGE_SIZE === 0
      );

      const command = new PutCommand({
        TableName: process.env['DYNAMODB_TABLE_META'],
        Item: { name: 'pages', value: pages },
      });
      await client.send(command);

      const command2 = new PutCommand({
        TableName: process.env['DYNAMODB_TABLE_META'],
        Item: { name: 'count', value: dataItems.length },
      });
      await client.send(command2);
    }
  }, Promise.resolve());
};
