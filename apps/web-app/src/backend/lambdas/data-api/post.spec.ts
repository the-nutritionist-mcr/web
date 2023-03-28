import { mock } from 'jest-mock-extended';
import { handler } from './post';

import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';
import { v4 } from 'uuid';
import { APIGatewayProxyEventV2, EventBridgeEvent } from 'aws-lambda';
import { HTTP } from '../../../infrastructure/constants';
import { HttpError } from './http-error';

jest.mock('uuid');
jest.mock('./authorise');

const dynamodbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  jest.resetAllMocks();
  dynamodbMock.reset();
  delete process.env['DYNAMODB_TABLE'];
});

describe('the get handler', () => {
  it('returns a response with the statuscode from the error when an httpError is thrown by authorise', async () => {
    jest
      .mocked(authoriseJwt)
      .mockRejectedValue(new HttpError(HTTP.statusCodes.Forbidden, 'oh no!'));

    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const inputItem = {
      foo: 'baz',
    };

    jest.mocked(v4).mockReturnValue('my-uuid');

    const mockInput = mock<
      APIGatewayProxyEventV2 & EventBridgeEvent<string, unknown>
    >();

    mockInput.body = JSON.stringify(inputItem);

    const response = await handler(mockInput, mock(), mock());

    expect(response).toEqual(
      expect.objectContaining({ statusCode: HTTP.statusCodes.Forbidden })
    );
  });

  it('calls dynamodb putItem with input object and a generated id and returns the id', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const inputItem = {
      foo: 'baz',
    };

    jest.mocked(v4).mockReturnValue('my-uuid');

    const mockInput = mock<
      APIGatewayProxyEventV2 & EventBridgeEvent<string, unknown>
    >();

    mockInput.body = JSON.stringify(inputItem);

    const response = await handler(mockInput, mock(), mock());

    const calls = dynamodbMock.commandCalls(PutCommand, {
      TableName: 'foo-table',
      Item: { id: 'my-uuid', ...inputItem },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    expect(calls).toHaveLength(1);

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ id: 'my-uuid' }),

      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    });
  });
});
