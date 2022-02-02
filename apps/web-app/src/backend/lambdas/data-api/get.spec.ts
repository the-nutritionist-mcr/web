import { mock } from 'jest-mock-extended';
import { handler } from './get';

import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const dynamodbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  jest.resetAllMocks();
  dynamodbMock.reset();
  delete process.env['DYNAMODB_TABLE'];
});

describe('the get handler', () => {
  it('returns the response from a call to the dynmodb scan operation for a given table', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const expectedItems = [
      {
        foo: 'bar'
      },
      {
        foo: 'baz'
      }
    ];

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table'
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ items: expectedItems }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*'
      }
    });
  });

  it('does not return items marked as deleted', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const expectedItems = [
      {
        foo: 'bar',
        deleted: true
      },
      {
        foo: 'baz'
      }
    ];

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table'
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ items: [{ foo: 'baz' }] }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*'
      }
    });
  });
});
