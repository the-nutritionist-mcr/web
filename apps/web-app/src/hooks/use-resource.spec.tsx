import { renderHook } from '@testing-library/react-hooks';
import { CognitoUser, currentUser } from '../aws/authenticate';
import { useResource } from './use-resource';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import nock from 'nock';
import { mock } from 'jest-mock-extended';

jest.mock('../aws/authenticate');

const SwrConfigComponent = (props: { children: ReactNode }) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    {props.children}
  </SWRConfig>
);

const dummyAppConfig = `{
  "tnm-web-cypress-stack": {
    "dataapiEndpointFF8416B3": "https://wpheqoxxhh.execute-api.eu-west-2.amazonaws.com/prod/",
    "UserPoolId": "us-east-1_ilYruIOKK",
    "DomainName": "cypress.app.thenutritionistmcr.com",
    "StaticsBucket": "cypress.app.thenutritionistmcr.com",
    "ClientId": "6cncblhq2rca7cbaonohphndh2",
    "pagesapiEndpoint356D7B8F": "https://qwr7u2pnr4.execute-api.eu-west-2.amazonaws.com/prod/",
    "CloudfrontId": "E1RLK0WLWKWY1J",
    "ApiDomainName": "api.cypress.app.thenutritionistmcr.com"
  }
}
`;

process.env.FETCH_BASE_URL = 'http://localhost';

const mockToken = 'mock-token';

beforeEach(() => {
  jest.resetAllMocks();
  nock.disableNetConnect();
  process.env.FETCH_BASE_URL = 'http://localhost';
  const root = nock('http://localhost');
  root
    .get('/app-config.json')
    .reply(200, dummyAppConfig)
    .get('/app-config.json');

  root.persist();

  jest.mocked(currentUser).mockResolvedValue(
    mock<CognitoUser>({
      signInUserSession: {
        accessToken: {
          jwtToken: mockToken,
        },
      },
    })
  );
});

afterEach(async () => {
  nock.cleanAll();
  nock.enableNetConnect();

  // No idea why this works but it does https://github.com/vercel/swr/issues/781
  await new Promise(requestAnimationFrame);
});

describe('useResource', () => {
  it.skip('returns undefined on first load', () => {
    const { result } = renderHook(() => useResource({ type: 'foo' }), {
      wrapper: SwrConfigComponent,
    });

    expect(result.current.items).toBeUndefined();
  });

  it.skip('makes a call to the api with the token attached and returns the response', async () => {
    const mockItems = [
      {
        id: '1',
        foo: 'bar',
      },
      {
        id: '2',
        foo: 'baz',
      },
    ];

    const mockResponse = {
      items: mockItems,
    };

    nock('https://api.cypress.app.thenutritionistmcr.com:443', {
      encodedQueryParams: true,
      reqheaders: {
        authorization: mockToken,
      },
    })
      .get('/foo')
      .reply(200, mockResponse);

    const { result, waitForNextUpdate } = renderHook(
      () => useResource({ type: 'foo' }),
      {
        wrapper: SwrConfigComponent,
      }
    );

    await waitForNextUpdate();

    expect(result.current.items).toEqual(mockItems);
  });

  it.skip('create makes a post request that optimistically opdates current dataset', async () => {
    const mockItems = [
      {
        id: '1',
        foo: 'bar',
      },
      {
        id: '2',
        foo: 'baz',
      },
    ];

    const mockResponse = {
      items: mockItems,
    };

    nock('https://api.cypress.app.thenutritionistmcr.com:443', {
      encodedQueryParams: true,
      reqheaders: {
        authorization: mockToken,
      },
    })
      .get('/foo')
      .reply(200, mockResponse)
      .post('/foo')
      .reply(200, { id: '3' });

    const { result, waitForNextUpdate } = renderHook(
      () => useResource<{ id: string; foo: string }>({ type: 'foo' }),
      {
        wrapper: SwrConfigComponent,
      }
    );

    await waitForNextUpdate();

    const newItem = {
      id: '0',
      foo: 'bip',
    };

    result.current.create(newItem);

    await waitForNextUpdate();

    expect(result.current.items).toEqual([...mockItems, newItem]);

    await waitForNextUpdate();

    expect(result.current.items).toEqual([
      ...mockItems,
      { id: '3', foo: 'bip' },
    ]);
  });
});
