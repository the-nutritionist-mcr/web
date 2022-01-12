import App from './app';
import { BrowserRouter as Router } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { configAmplify } from '../../lib/config-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

const AppWrapper: FC = () => {

  useEffect(() => {
    (async () => {
      await configAmplify();
    })();
  });

  const AuthenticatedApp = withAuthenticator(App);

  return (
      <Router>
        <AuthenticatedApp />
      </Router>
  );
};

export default AppWrapper;
