import Authenticated, { Redirect } from './authenticated';
import { mockDependencies } from '../../test-support';
import { render, waitFor } from '@testing-library/react';

describe('The <Authenticated> component', () => {
  it('Redirects to /login/ when there is no user', async () => {
    const navigate = jest.fn();
    mockDependencies({ navigate });

    render(
      <Authenticated user={undefined} redirect={Redirect.IfLoggedOut}>
        Hello!
      </Authenticated>
    );

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login/'));
  });
});
