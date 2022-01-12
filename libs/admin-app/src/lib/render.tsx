import { App } from "../components";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import log from "loglevel";
import reportWebVitals from "../reportWebVitals";
import store from "../lib/store";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { configAmplify } from "./config-amplify";

const render = async (): Promise<void> => {
  await configAmplify();
  log.trace("Beginning initial render");
  const AuthenticatedApp = withAuthenticator(App);

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <AuthenticatedApp />
        </Router>
      </Provider>
    </React.StrictMode>,
    document.querySelector("#root")
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
};

export default render;
