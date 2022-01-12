import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Grommet, Main } from "grommet";
import { NavBar, Router } from "..";
import { Notification } from "grommet-controls";
import React from "react";

import UserContext from "../../lib/UserContext";
import log from "loglevel";
import { useApp } from "./hooks";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "14pt",
      height: "20px",
    },
  },
};

const ErrorComponent: React.FC<FallbackProps> = (props) => (
  <Notification status="error" message="Error" state={props.error.message} />
);

const App: React.FC = () => {
  const state = useApp();

  return (
    <UserContext.Provider value={state.user}>
      <Grommet theme={theme}>
        <NavBar />

        <ErrorBoundary
          FallbackComponent={ErrorComponent}
          onError={(error) => {
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
          <Main pad={{ horizontal: "large", vertical: "medium" }}>
            <Router />
          </Main>
        </ErrorBoundary>
      </Grommet>
    </UserContext.Provider>
  );
};

export default App;
