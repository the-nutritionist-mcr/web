import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Grommet, Main } from 'grommet';
import { NavBar, Router } from '..';
import { Provider } from 'react-redux';
import { buildStore } from '../../lib/store';
import { Notification } from 'grommet-controls';
import React, { useEffect, useState } from 'react';

import UserContext from '../../lib/UserContext';
import log from 'loglevel';
import { useApp } from './hooks';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14pt',
      height: '20px'
    }
  }
};

const ErrorComponent: React.FC<FallbackProps> = props => (
  <Notification status="error" message="Error" state={props.error.message} />
);

const App: React.FC = () => {
  const state = useApp();

  const [store, setStore] = useState<
    ReturnType<typeof buildStore> | undefined
  >();

  useEffect(() => {
    setStore(buildStore());
  }, []);

  return store ? (
    <Provider store={store}>
      <UserContext.Provider value={state.user}>
        <Grommet theme={theme}>
          <NavBar />

          <ErrorBoundary
            FallbackComponent={ErrorComponent}
            onError={error => {
              log.error(error);
            }}
          >
            {state.error && (
              <Notification
                status="error"
                message="Error"
                state={state.error}
                onClose={state.closeError}
              />
            )}
            <Main pad={{ horizontal: 'large', vertical: 'medium' }}>
              <Router />
            </Main>
          </ErrorBoundary>
        </Grommet>
      </UserContext.Provider>
    </Provider>
  ) : // eslint-disable-next-line unicorn/no-null
  null;
};

export default App;
