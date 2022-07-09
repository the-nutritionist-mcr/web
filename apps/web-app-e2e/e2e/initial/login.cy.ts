import { E2E } from '@tnmw/constants';
describe('The login page', () => {
  before(() => {
    cy.task('deleteChargebeeCustomer', E2E.nonExistingUser.username);
    cy.task('deleteCognitoUser', E2E.nonExistingUser.username);
  });

  it('Should load a page with a login form', () => {
    cy.visit('/login/');
    cy.get('form').find('button').contains('Login');
  });

  it("Should display an error message if the user doesn't exist", () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form').find("input[name='email']").clear().type('a@b.c');
    cy.get('form').find("input[name='password']").clear().type('asdds');
    cy.get('form').find('button').contains('Login').click();
    cy.get('form').contains('User does not exist');
  });

  it('Should display an error message if your password is incorrect', () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form')
      .find("input[name='email']")
      .clear()
      .type(E2E.adminUserOne.email);

    cy.get('form').find("input[name='password']").clear().type('asdsdfasd');
    cy.get('form').find('button').contains('Login').click();
    cy.get('form').contains('Incorrect username or password');
  });

  it('Creating an account on ChargeBee should result in being sent a password that I can use to login and change my password with', () => {
    cy.task('createChargebeeCustomer');

    cy.task('getPasswordFromWelcomeEmailThenDelete').then((password) => {
      cy.visit('/login/');
      cy.get('form').should('be.visible');
      cy.get('form')
        .find("input[name='email']")
        .clear()
        .type(E2E.nonExistingUser.email);

      cy.get('form').find("input[name='password']").clear().type(password);
    });

    // cy.get('form').find('button').contains('Login').click();
    // cy.location('pathname').should('eq', '/account');

    // cy.visit('/login/');
    // cy.location('pathname').should('eq', '/account');
  });
});
