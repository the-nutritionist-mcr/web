import { E2E } from '@tnmw/constants';
import { Customers } from '../../src/pages/customers';

describe('The customers page', { scrollBehavior: false }, () => {
  before(() => {
    cy.task('deleteWelcomeEmails');
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
    cy.task('deleteCognitoUser', E2E.e2eCustomer.username);
  });

  beforeEach(() => {
    Customers.visit();

    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
  });

  it("Should load a page titled 'customers'", () => {
    Customers.visit();

    Customers.getHeader();
  });

  const customerNameString = `${E2E.e2eCustomer.surname}, ${E2E.e2eCustomer.firstName}`;

  it('Shouldnt have the test customer on the list from the start', () => {
    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
    Customers.visit();
    Customers.getTable().contains(customerNameString).should('not.exist');
  });

  it('Creating an account on Chargebee should result in a customer appearing on the customer list', () => {
    const user = {
      username: E2E.e2eCustomer.username,
      country: 'England',
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

    cy.task('createChargebeeCustomer', user);

    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });

    Customers.visit();
    Customers.getTable().contains(customerNameString, { timeout: 60_000 });
  });

  it('Email and delivery day details should be picked up by the portal on the customers page', () => {
    Customers.visit();
    Customers.clickEditLink(customerNameString);
  });
});
