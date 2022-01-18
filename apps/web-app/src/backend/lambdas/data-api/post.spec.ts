import { mock } from 'jest-mock-extended';
import { handler } from './post';

import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';

jest.mock('uuid');

const dynamodbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  jest.resetAllMocks();
  dynamodbMock.reset();
  delete process.env['DYNAMODB_TABLE'];
});

describe('the get handler', () => {
  it('calls dynamodb putItem with input object and a generated id and returns the id', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const inputItem = {
      foo: 'baz'
    };

    jest.mocked(v4).mockReturnValue('my-uuid');

    dynamodbMock
      .on(PutCommand, {
        TableName: 'foo-table',
        Item: { id: 'my-uuid', inputItem }
      })
      .resolves({});

    const mockInput = mock<APIGatewayProxyEventV2>();

    mockInput.body = JSON.stringify(inputItem);

    const response = await handler(mockInput, mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ id: 'my-uuid' })
    });
  });
});
