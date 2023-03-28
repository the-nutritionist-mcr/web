import { mock } from 'jest-mock-extended';
import { GetServerSidePropsContext } from 'next';
import { verifyJwtToken } from '@tnmw/authorise-cognito-jwt';
import { loggedOutOnlyRoute } from './logged-out-only-route';

jest.mock('@tnmw/authorise-cognito-jwt');

describe('logged out only route', () => {
  it('redirects to the supplied route if there is an accessToken and verification is successful', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      firstName: 'Ben',
      surname: 'W',
      userName: 'user',
      isValid: true,
      groups: [],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'foo.accessToken': 'invalidtoken' };

    const serversidePropsCallback = loggedOutOnlyRoute('home');
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: '/home', permanent: false },
    });
  });

  it('does not redirect if there is no token', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      firstName: 'Ben',
      surname: 'W',
      userName: 'user',
      isValid: true,
      groups: [],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'not-a-token': 'thing' };

    const serversidePropsCallback = loggedOutOnlyRoute('home');
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      props: {},
    });
  });

  it('does not redirect if verification fails', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      firstName: 'Ben',
      surname: 'W',
      userName: '',
      isValid: false,
      groups: [],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'foo.accessToken': 'thing' };

    const serversidePropsCallback = loggedOutOnlyRoute('home');
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      props: {},
    });
  });

  it('calls the supplied serverSideProps callback and returns the result if supplied', async () => {
    jest.mocked(verifyJwtToken).mockResolvedValue({
      firstName: 'Ben',
      surname: 'W',
      userName: '',
      isValid: false,
      groups: [],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext['req']>();
    mockContext.req.cookies = { 'foo.accessToken': 'thing' };

    const mockProps = { props: {} };
    const getServerSideProps = jest.fn(() => Promise.resolve(mockProps));

    const serversidePropsCallback = loggedOutOnlyRoute(
      'home',
      getServerSideProps
    );
    const response = await serversidePropsCallback(mockContext);

    expect(getServerSideProps).toHaveBeenCalled();
    expect(response).toBe(mockProps);
  });
});
