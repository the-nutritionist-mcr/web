import { render } from '@testing-library/react';
import TnmApp from './_app.page';
import { Router } from 'next/router';
import { mock } from 'jest-mock-extended';
import { screen } from '@testing-library/react';

test('the app page renders correctly without error when passed a component', () => {
  const component = () => <></>;
  const mockRouter = mock<Router>();

  render(<TnmApp router={mockRouter} pageProps={{}} Component={component} />);
});

test('the app page renders the component that was passed to it', () => {
  const component = () => <>Hello!</>;
  const mockRouter = mock<Router>();

  render(<TnmApp router={mockRouter} pageProps={{}} Component={component} />);

  expect(screen.queryByText('Hello!')).toBeInTheDocument();
});
