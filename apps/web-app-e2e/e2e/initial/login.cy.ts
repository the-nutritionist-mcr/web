import { E2E } from '@tnmw/constants';
import { AccountPage } from '../../src/pages/account';
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

  it('Creating an account on ChargeBee should result in being sent a password that I can use to login and change my password with', () => {
    cy.task('createChargebeeCustomer');

    cy.task('getPasswordFromWelcomeEmailThenDelete').then(
      (password: string) => {
        LoginPage.visit();
        LoginPage.getLoginForm().should('exist');
        LoginPage.fillEmailInput(E2E.nonExistingUser.email);

        LoginPage.fillPasswordInput(password);
        LoginPage.clickLoginButton();
        LoginPage.getSubmitButton().should('exist');
        LoginPage.fillPasswordInput(E2E.nonExistingUser.password);
        LoginPage.clickSubmitButton();

        AccountPage.isInNavbar();
      }
    );
  });

  it('redirects you straight to the account page next time you login once the password has been changed', () => {
    LoginPage.visit();
    LoginPage.getLoginForm().should('be.visible');
    LoginPage.fillEmailInput(E2E.nonExistingUser.email);
    LoginPage.fillPasswordInput(E2E.nonExistingUser.password);

    LoginPage.clickLoginButton();
    AccountPage.isInNavbar();
  });
});
