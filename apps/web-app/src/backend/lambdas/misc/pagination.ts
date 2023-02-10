import { DynamoDBStreamHandler } from 'aws-lambda';
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { scan } from '@tnmw/dynamo';

export const handler: DynamoDBStreamHandler = async (event) => {
  const dynamodb = new DynamoDBClient({});

  const client = DynamoDBDocumentClient.from(dynamodb);

  await event.Records.reduce(async (previous, record) => {
    await previous;
    const { eventName } = record;
    try {
      if (eventName === 'INSERT' || eventName === 'REMOVE') {
        const inc = eventName === 'INSERT' ? 1 : -1;
        const command = new UpdateCommand({
          TableName: process.env['DYNAMODB_TABLE'],
          Key: { id: 'count' },
          ExpressionAttributeValues: { ':inc': inc },
          UpdateExpression: 'ADD count :inc',
          ConditionExpression: 'attribute_exists(id)',
        });

        await client.send(command);
      }
    } catch {
      const items = await scan(
        client,
        process.env['DYNAMODB_TABLE'] ?? '',
        undefined
      );

      const count = items.length;

      const command = new PutCommand({
        TableName: process.env['DYNAMODB_TABLE'],
        Item: { id: 'count', count },
      });
      await client.send(command);
    }
  }, Promise.resolve());
};
