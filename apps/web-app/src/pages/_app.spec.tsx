import { render } from '@testing-library/react';
import TnmApp from './_app.page';
import { Router } from 'next/router';
import { mock } from 'jest-mock-extended';
import { screen } from '@testing-library/react';
import { getAppConfig } from '@tnmw/utils';

// eslint-disable-next-line unicorn/prefer-module
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('@tnmw/utils');
jest.mock('../aws/authenticate');

beforeEach(() => {
  jest.mocked(getAppConfig).mockResolvedValue({
    DomainName: 'foo',
    UserPoolId: 'pool-id',
    AwsRegion: 'eu-west-2',
    Environment: 'test',
    ChargebeeUrl: 'url',
    ClientId: 'client-id',
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
