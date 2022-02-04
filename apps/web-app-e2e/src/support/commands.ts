import { Auth } from '@aws-amplify/auth';
import { getPoolConfig } from './get-pool-config';

const configureCognitoAndSignIn = async (
  username: string,
  password: string
) => {
  const outputs = await getPoolConfig();

  const REGION = 'eu-west-2';

  Auth.configure({
    Auth: {
      region: REGION,
      userPoolId: outputs.UserPoolId,
      userPoolWebClientId: outputs.ClientId,
    },
  });
  return Auth.signIn({ username, password });
};

declare global {
  namespace Cypress {
    interface Chainable {
      loginByCognitoApi(username: string, password: string): Chainable;
      seed(): void;
      addStubs(): void;
    }
  }
}

Cypress.Commands.add('seed', () => {
  cy.task('seedCognito', {
    poolId: Cypress.env('POOL_ID'),
    registerUser: Cypress.env('TEST_REGISTER_USER'),
    email: Cypress.env('TEST_EMAIL'),
    password: Cypress.env('TEST_USER_INITIAL_PASSWORD'),
    testUserEmail: Cypress.env('INT_TEST_EMAIL'),
    testUserPassword: Cypress.env('INT_TEST_PASSWORD'),
  });
});

// Taken from https://docs.cypress.io/guides/testing-strategies/amazon-cognito-authentication#Custom-Command-for-Amazon-Cognito-Authentication
// Amazon Cognito
Cypress.Commands.add('loginByCognitoApi', (username, password) => {
  const log = Cypress.log({
    displayName: 'COGNITO LOGIN',
    message: [],
    // @ts-ignore
    autoEnd: false,
  });

  const signIn = configureCognitoAndSignIn(username, password);

  log.snapshot('before');

  cy.wrap(signIn, { log: false }).then((cognitoResponse: any) => {
    const log = Cypress.log({
      displayName: 'Here',
      message: [
        `🔐 Authenticated, saving tokens: `,
        JSON.stringify(cognitoResponse, null, 2),
      ],
    });

    const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;

    cy.setCookie(
      `${keyPrefixWithUsername}.idToken`,
      cognitoResponse.signInUserSession.idToken.jwtToken
    );

    cy.setCookie(
      `${keyPrefixWithUsername}.accessToken`,
      cognitoResponse.signInUserSession.accessToken.jwtToken
    );

    cy.setCookie(
      `${keyPrefixWithUsername}.refreshToken`,
      cognitoResponse.signInUserSession.refreshToken.token
    );

    cy.setCookie(
      `${keyPrefixWithUsername}.clockDrift`,
      String(cognitoResponse.signInUserSession.clockDrift)
    );

    cy.setCookie(
      `${cognitoResponse.keyPrefix}.LastAuthUser`,
      cognitoResponse.username
    );

    cy.setCookie('amplify-authenticator-authState', 'signedIn');
    log.snapshot('after');
    log.end();
  });
});
