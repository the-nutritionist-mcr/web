import '@testing-library/cypress/add-commands';
import { configureCognitoAndSignIn } from './configure-cognito-and-sign-in';
import { seed } from './seed-app';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginByCognitoApi(arg: { user: string; password: string }): Chainable;
      logoutByCognitoApi(): Chainable;
      seed(): Chainable;
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

Cypress.Commands.add('seed', () => seed());

// Taken from https://docs.cypress.io/guides/testing-strategies/amazon-cognito-authentication#Custom-Command-for-Amazon-Cognito-Authentication
// Amazon Cognito
Cypress.Commands.add(
  'loginByCognitoApi',
  (arg: { user: string; password: string }) => {
    cy.session(
      [arg.user, arg.password],
      () => {
        const signIn = configureCognitoAndSignIn(arg.user, arg.password);

        type ExtractPromiseType<T> = T extends Promise<infer P> ? P : never;
        cy.wrap(signIn, { log: false }).then(
          (cognitoResponse: ExtractPromiseType<typeof signIn>) => {
            const log = Cypress.log({
              displayName: 'Here',
              message: [`🔐 Authenticated, saving tokens`],
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
          }
        );
      },
      {
        cacheAcrossSpecs: true,
      }
    );
  }
);
