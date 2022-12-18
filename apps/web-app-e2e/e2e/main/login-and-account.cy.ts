import { E2E } from '@tnmw/constants';
// import { AccountPage } from '../../src/pages/account';
import { LoginPage } from '../../src/pages/login';
import { Customers } from '../../src/pages/customers';
import { EditCustomer } from '../../src/pages/edit-customer';
import { AccountPage } from '../../src/pages/account';

describe('The login page', { scrollBehavior: false }, () => {
  before(() => {
    cy.seed();
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
  });

  const customerNameString = `${E2E.e2eCustomer.surname}, ${E2E.e2eCustomer.firstName}`;

  it('Should load a page with a login form', () => {
    LoginPage.visit();
    LoginPage.getLoginButton();
  });

  it("Should display an error message if the user doesn't exist", () => {
    LoginPage.visit();
    LoginPage.getLoginForm().should('be.visible');

    LoginPage.fillEmailInput('c@b.c.uk');
    LoginPage.fillPasswordInput('asdds');
    LoginPage.clickLoginButton();

    LoginPage.getLoginForm().contains('User does not exist');
  });

  it('Should display an error message if your password is incorrect', () => {
    LoginPage.visit();
    LoginPage.getLoginForm().should('be.visible');

    LoginPage.fillEmailInput(E2E.normalUserOne.email);
    LoginPage.fillPasswordInput('asdsdfasd');
    LoginPage.clickLoginButton();

    LoginPage.getLoginForm().contains('Incorrect username or password');
  });

  it.skip('Creating an account on Chargebee results in an account that a user can use to login with and view the account page', () => {
    cy.loginByCognitoApi({
      user: E2E.adminUserTwo.email,
      password: E2E.adminUserTwo.password,
    });

    const user = {
      username: E2E.e2eCustomer.username,
      country: E2E.e2eCustomer.country,
      deliveryDay1: E2E.e2eCustomer.deliveryDay1,
      deliveryDay2: E2E.e2eCustomer.deliveryDay2,
      addressLine1: E2E.e2eCustomer.addressLine1,
      addressLine2: E2E.e2eCustomer.addressLine2,
      phoneNumber: E2E.e2eCustomer.phoneNumber,
      addressLine3: E2E.e2eCustomer.addressLine3,
      firstName: E2E.e2eCustomer.firstName,
      surname: E2E.e2eCustomer.surname,
      email: E2E.e2eCustomer.email,
      city: E2E.e2eCustomer.city,
      postcode: E2E.e2eCustomer.postcode,
    };

    cy.task('waitUntilUserDoesntExist', E2E.e2eCustomer.username).then(() => {
      cy.task('createChargebeeCustomer', user);

      Customers.visit();
      Customers.clickEditLink(customerNameString, 5 * 60_000);
      EditCustomer.getHeader();
      EditCustomer.resetPassword(false, E2E.e2eCustomer.password);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.clearCookies();

      LoginPage.visit();
      LoginPage.getLoginForm().should('exist');
      LoginPage.fillEmailInput(E2E.e2eCustomer.email);
      LoginPage.fillPasswordInput(E2E.e2eCustomer.password);
      LoginPage.clickLoginButton();

      AccountPage.isInNavbar();
      AccountPage.getYourDetailsHeader();
    });
  });

  it.skip('Account page should contain all the details from the Chargeebee record', () => {
    cy.loginByCognitoApi({
      user: E2E.e2eCustomer.email,
      password: E2E.e2eCustomer.password,
    });

    AccountPage.visit();

    AccountPage.getFirstNameField().should(
      'have.value',
      E2E.e2eCustomer.firstName
    );

    AccountPage.getSurnameField().should('have.value', E2E.e2eCustomer.surname);

    AccountPage.getPhonenumberField().should(
      'have.value',
      E2E.e2eCustomer.phoneNumberFull
    );

    AccountPage.getAddress1Field().should(
      'have.value',
      E2E.e2eCustomer.addressLine1
    );

    AccountPage.getAddress2Field().should(
      'have.value',
      E2E.e2eCustomer.addressLine2
    );

    AccountPage.getCountryField().should('have.value', E2E.e2eCustomer.country);

    AccountPage.getPostcodeField().should(
      'have.value',
      E2E.e2eCustomer.postcode
    );

    AccountPage.getCityField().should('have.value', E2E.e2eCustomer.city);
  });
});
