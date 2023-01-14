import { mock } from 'jest-mock-extended';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { authorizedRoute, AuthorizedRouteProps } from './authorised-route';
import { getUserFromAws } from './get-user-from-aws';
import { BackendCustomer } from '@tnmw/types';

jest.mock('@tnmw/authorise-cognito-jwt');
jest.mock('./get-user-from-aws');

describe('authorised route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(getUserFromAws)
      .mockResolvedValue({} as Awaited<ReturnType<typeof getUserFromAws>>);
  });

  it('always uses the token of the LastAuthUser', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: 'user',
      firstName: 'user',
      surname: 'name',
      isValid: true,
      groups: ['a-different-group', 'a-group'],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = {
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.the-customer-id.clockDrift':
        '0',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.the-customer-id.idToken':
        'wrongIdToken',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.the-customer-id.accessToken':
        'wrongAccessToken',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.the-customer-id.refreshToken':
        'wrongRefreshToken',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.LastAuthUser':
        'cypress-test-user',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.cypress-test-user.clockDrift':
        '-4',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.cypress-test-user.idToken':
        'my-id-token',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.cypress-test-user.accessToken':
        'my-access-token',
      'CognitoIdentityServiceProvider.5cduopruc8j1ped1ccrpe2mout.cypress-test-user.refreshToken':
        'my-refresh-token',
    };
    const mockProps = {
      props: { user: mock<BackendCustomer & { admin: boolean }>() },
    };

    const getServerSideProps = jest.fn<
      Promise<GetServerSidePropsResult<AuthorizedRouteProps>>,
      [GetServerSidePropsContext]
    >(() => Promise.resolve(mockProps));

    const serversidePropsCallback = authorizedRoute({ getServerSideProps });
    await serversidePropsCallback(mockContext);

    expect(getServerSideProps).toHaveBeenCalled();
    expect(jest.mocked(verifyJwtToken)).toHaveBeenCalledWith({
      token: 'my-access-token',
    });
  });

  it('redirects to the login route without trying to verify if there is no token cookie', async () => {
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { foo: 'bar' };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: '/login', permanent: false },
    });
    expect(jest.mocked(verifyJwtToken)).not.toHaveBeenCalled();
  });

  it('redirects to the login route if the token cookie fails to verify', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: '',
      firstName: 'user',
      surname: 'name',
      isValid: false,
      groups: [],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'foo.accessToken': 'invalidtoken' };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: '/login', permanent: false },
    });
  });

  it('redirects to the login route if verify is successful but there are groups passed in that are not returned in the claim', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: 'user',
      isValid: true,
      firstName: 'user',
      surname: 'name',
      groups: ['a-different-group'],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'foo.accessToken': 'invalidtoken' };

    const serversidePropsCallback = authorizedRoute({ groups: ['a-group'] });
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: '/login', permanent: false },
    });
  });

  it('does not redirect to login if verify is successful and a group is returned by the claim that was passed in', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: 'user',
      isValid: true,
      firstName: 'user',
      surname: 'name',
      groups: ['a-different-group', 'a-group'],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = {
      'foo.accessToken': 'invalidtoken',
      LastAuthUser: 'foo',
    };

    const serversidePropsCallback = authorizedRoute({ groups: ['a-group'] });
    const response = await serversidePropsCallback(mockContext);

    console.log(response);

    expect(response).toEqual(
      expect.objectContaining({
        props: { user: expect.objectContaining({ admin: false }) },
      })
    );
  });

  it('does not redirect to login if no groups were passed in regardless of what groups were returned by the claim', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: 'user',
      isValid: true,
      firstName: 'user',
      surname: 'name',
      groups: ['a-different-group', 'a-group'],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = {
      'foo.accessToken': 'invalidtoken',
      LastAuthUser: 'foo',
    };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      props: { user: expect.objectContaining({ admin: false }) },
    });
  });

  it('calls the supplied serversideprops callback and returns the result if verify is successful', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      userName: 'user',
      isValid: true,
      firstName: 'user',
      surname: 'name',
      groups: ['a-different-group', 'a-group'],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = {
      'foo.accessToken': 'a.valid.token',
      LastAuthUser: 'foo',
    };

    const mockProps = {
      props: { user: mock<BackendCustomer & { admin: boolean }>() },
    };
    const getServerSideProps = jest.fn<
      Promise<GetServerSidePropsResult<AuthorizedRouteProps>>,
      [GetServerSidePropsContext]
    >(() => Promise.resolve(mockProps));

    const serversidePropsCallback = authorizedRoute({ getServerSideProps });
    const response = await serversidePropsCallback(mockContext);

    expect(getServerSideProps).toHaveBeenCalled();
    expect(response).toEqual(mockProps);
  });
});
