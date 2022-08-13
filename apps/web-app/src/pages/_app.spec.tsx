import { render } from '@testing-library/react';
import TnmApp from './_app.page';
import { Router } from 'next/router';
import { mock } from 'jest-mock-extended';
import { screen } from '@testing-library/react';
import { getAppConfig } from '@tnmw/utils';

jest.mock('@tnmw/utils');
jest.mock('../aws/authenticate');

beforeEach(() => {
  jest.mocked(getAppConfig).mockResolvedValue({
    DomainName: 'foo',
    UserPoolId: 'pool-id',
    ClientId: 'client-id',
    RedirectUrl: 'redirect-url',
    AuthUrl: 'auth-url',
    ApiDomainName: 'locahost',
  });
});

test('the app page renders correctly without error when passed a component', () => {
  const component = () => <></>;
  const mockRouter = mock<Router>();

  render(<TnmApp router={mockRouter} pageProps={{}} Component={component} />);
});

test('the app page renders the component that was passed to it', () => {
  const component = () => <>Hello!</>;
  const mockRouter = mock<Router>();

  render(<TnmApp router={mockRouter} pageProps={{}} Component={component} />);

  expect(screen.queryByText('Hello!')).toBeTruthy();
});
