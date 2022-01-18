import { mock } from 'jest-mock-extended';
import { handler } from './get';

beforeEach(() => {
  jest.resetAllMocks();
  delete process.env['DYNAMODB_TABLE'];
});

describe('the get handler', () => {
  it('returns the response from a call to the dynmodb scan operation for a given table', async () => {
    process.env['DYNAMODB_TABLE'] = 'foo-table';

    await handler(mock(), mock(), mock());
  });
});
