import Layout from './layout';
import { render, screen } from '../../test-support';
import { useContext } from 'react';
import { UserContext } from '../../contexts';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('the layout component', () => {
  it('renders without errors', () => {
    render(<Layout>Something</Layout>);
  });

  it('renders its children', () => {
    render(
      <Layout>
        <p>Child Node</p>
      </Layout>
    );

    expect(screen.queryByText('Child Node')).toBeInTheDocument();
  });

  it('Provides a callback that can be used to change the current user', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const ChildComponent = () => {
      const { user, setUser } = useContext(UserContext);
      return (
        <>
          <button
            onClick={() =>
              setUser?.({
                email: 'email',
                name: 'a-new-username',
                admin: false,
              })
            }
          >
            Click me
          </button>
          {user?.name}
        </>
      );
    };

    render(
      <Layout>
        <ChildComponent />
      </Layout>
    );

    act(() => {
      const button = screen.getByText('Click me');
      userEvent.click(button);
    });

    const newText = await screen.findByText('a-new-username');
    expect(newText).toBeInTheDocument();
  });

  it('sets the current authenticated user', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const ChildComponent = () => {
      const { user } = useContext(UserContext);
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{user?.name}</>;
    };

    render(
      <Layout>
        <ChildComponent />
      </Layout>
    );

    const userText = await screen.findByText('foo!');

    expect(userText).toBeInTheDocument();
  });
});
