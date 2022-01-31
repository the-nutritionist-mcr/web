import { mock } from 'jest-mock-extended';
import { handler } from './put';

import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const dynamodbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  jest.resetAllMocks();
  dynamodbMock.reset();
  delete process.env['DYNAMODB_TABLE'];
});

describe('the get handler', () => {
  it('calls dynamodb putItem with input object and returns success', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const inputItem = {
      foo: 'baz',
    };

    const mockInput = mock<APIGatewayProxyEventV2>();

    mockInput.body = JSON.stringify(inputItem);

    const response = await handler(mockInput, mock(), mock());

    const calls = dynamodbMock.commandCalls(PutCommand, {
      TableName: 'foo-table',
      Item: { ...inputItem },
      ConditionExpression: 'attribute_exists(id)',
    });

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({}),

      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    });
  });
});
