import { mock } from 'jest-mock-extended';
import { handler } from './get';

import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
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
        foo: 'bar',
      },
      {
        foo: 'baz',
      },
    ];

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
        foo: 'bar',
      },
      {
        foo: 'baz',
      },
    ];

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table',
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ items: expectedItems }),
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
        foo: 'bar',
        deleted: true,
      },
      {
        foo: 'baz',
      },
    ];

    dynamodbMock
      .on(ScanCommand, {
        TableName: 'foo-table',
      })
      .resolves({ Items: expectedItems });

    const response = await handler(mock(), mock(), mock());

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ items: [{ foo: 'baz' }] }),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': allowHeaders.join(', '),
      },
    });
  });
});
