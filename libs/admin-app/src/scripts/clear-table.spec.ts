import * as database from '../backend/database';
import { resetAllWhenMocks, when } from 'jest-when';
import clearTable from './clear-table';
import { mocked } from 'ts-jest/utils';

jest.mock('../backend/database');

describe('clear-table', () => {
  beforeEach(() => {
    resetAllWhenMocks();
  });

  it('Calls database.deleteAll with the results from database.getAll', async () => {
    when(mocked(database.getAll, true))
      .calledWith('foo-table')
      .mockResolvedValue([{ id: '0' }, { id: '2' }, { id: '3' }]);

    await clearTable('foo-table');

    expect(database.deleteAll).toBeCalledWith([
      { table: 'foo-table', id: '0' },
      { table: 'foo-table', id: '2' },
      { table: 'foo-table', id: '3' },
    ]);
  });
});
