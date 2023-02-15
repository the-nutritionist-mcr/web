import { mock } from 'jest-mock-extended';
import { handler } from './get';

import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { authoriseJwt } from './authorise';
import { HttpError } from './http-error';
import { HTTP } from '../../../infrastructure/constants';
import { allowHeaders } from '../../allow-headers';

const dynamodbMock = mockClient(DynamoDBDocumentClient);

jest.mock('./authorise');

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

    const expectedItems = [
      {
        id: 'foo',
        foo: 'bar',
      },
      {
        id: 'another',
        foo: 'baz',
      },
    ];

    const pages = ['foo'];

    dynamodbMock
      .on(GetCommand, {
        TableName: 'foo-table',
        Key: { id: 'pages' },
      })
      .resolves({
        Item: {
          pages,
          count: 1,
        },
      });

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table',
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toEqual(
      expect.objectContaining({ statusCode: HTTP.statusCodes.Forbidden })
    );
  });

  it('returns the response from a call to the dynmodb scan operation for a given table', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const expectedItems = [
      {
        id: 'foo',
        foo: 'bar',
      },
      {
        foo: 'baz',
      },
    ];

    const pages = ['foo'];

    dynamodbMock
      .on(GetCommand, {
        TableName: 'foo-table',
        Key: { id: 'pages' },
      })
      .resolves({
        Item: {
          pages,
          count: 1,
        },
      });

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table',
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ count: 1, items: expectedItems }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': allowHeaders.join(', '),
      },
    });
  });

  it('does not return items marked as deleted', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    const expectedItems = [
      {
        id: 'foo',
        deleted: true,
      },
      {
        foo: 'baz',
      },
    ];

    const pages = ['foo'];

    dynamodbMock
      .on(GetCommand, {
        TableName: 'foo-table',
        Key: { id: 'pages' },
      })
      .resolves({
        Item: {
          pages,
          count: 1,
        },
      });

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table',
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ count: 1, items: [{ foo: 'baz' }] }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': allowHeaders.join(', '),
      },
    });
  });
});
