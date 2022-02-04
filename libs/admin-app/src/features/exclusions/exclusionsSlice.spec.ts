import API, { graphqlOperation } from '@aws-amplify/api';
import { resetAllWhenMocks, when } from 'jest-when';
import { fetchExclusions } from './exclusionsSlice';

import { listExclusionsQuery } from './graphql';
import { mocked } from 'ts-jest/utils';

jest.mock('@aws-amplify/api');

beforeEach(() => {
  resetAllWhenMocks();
});

describe('fetchExclusions', () => {
  it('Dispatches the fullfilled action with the results returend from the GraphQL API', async () => {
    when(mocked(graphqlOperation))
      .calledWith(listExclusionsQuery)
      .mockReturnValue({ query: 'go-go-go', variables: {}, authToken: 'foo' });

    when(mocked(API.graphql))
      .calledWith({ query: 'go-go-go', variables: {}, authToken: 'foo' })
      .mockResolvedValue({ data: { listExclusions: ['foo', 'bar'] } });

    const thunk = fetchExclusions();

    const dispatch = jest.fn();

    await thunk(dispatch, jest.fn(), jest.fn() as unknown as void);

    expect(dispatch).toHaveBeenCalledWith(
      fetchExclusions.fulfilled(['foo', 'bar'])
    );
  });
});
