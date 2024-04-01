import { E2E } from '@tnmw/constants';
import { LoginPage } from '../../src/pages/login';

describe('The login page', { scrollBehavior: false }, () => {
  before(() => {
    cy.task('deleteWelcomeEmails');
    cy.task('deleteChargebeeCustomer', E2E.nonExistingUser.username);
    cy.task('deleteCognitoUser', E2E.nonExistingUser.username);
  });

  it('Should load a page with a login form', () => {
    LoginPage.visit();
    
    LoginPage.getLoginButton();
  });

  it("Should display an error message if the user doesn't exist", () => {
    LoginPage.visit();
    LoginPage.getLoginForm().should('be.visible');

    LoginPage.fillEmailInput('a@b.c');
    LoginPage.fillPasswordInput('asdds');
    LoginPage.clickLoginButton();

    LoginPage.getLoginForm().contains('User does not exist');
  });

  it('Should display an error message if your password is incorrect', () => {
    LoginPage.visit();
    LoginPage.getLoginForm().should('be.visible');

    LoginPage.fillEmailInput(E2E.adminUserOne.email);
    LoginPage.fillPasswordInput('asdsdfasd');
    LoginPage.clickLoginButton();

    LoginPage.getLoginForm().contains('Incorrect username or password');
  });
});
