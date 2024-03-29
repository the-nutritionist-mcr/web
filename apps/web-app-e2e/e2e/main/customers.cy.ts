import { E2E } from '@tnmw/constants';
import { EditCustomer } from '../../src/pages/edit-customer';
import { Customers } from '../../src/pages/customers';

const customerNameString = `${E2E.e2eCustomer.surname}, ${E2E.e2eCustomer.firstName}`;
describe('The customers page', { scrollBehavior: false }, () => {
  before(() => {
    cy.seed();
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
  });

  beforeEach(() => {
    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
  });

  it.skip('Adding a custom plan is persisted between page loads');

  it.skip('Adding customisation tags is persisted between pageloads');

  it.skip(
    'Customisation tags that are added are visible on the customers list'
  );

  it.skip(
    'Clicking the reset password link results in the customer being sent an email containing a password they can login with'
  );

  it.skip(
    'Changing the customer name on Chargebee results on the name change appearing on the edit customer page'
  );

  it.skip(
    'Changing the customer email  on Chargebee results on the name change appearing on the edit customer page'
  );

  it.skip(
    'Changing the customer first delivery day  on Chargebee results on the name change appearing on the edit customer page'
  );

  it.skip(
    'Changing the customer second delivery day  on Chargebee results on the name change appearing on the edit customer page'
  );

  it.skip('Adding a pause is correctly picked up on the edit customer page');

  it("Should load a page titled 'customers'", () => {
    Customers.visit();

    Customers.getHeader();
  });

  it.skip('Shouldnt have the test customer on the list from the start', () => {
    Customers.visit();
    Customers.getTable().contains(customerNameString).should('not.exist');
  });

  it('Creating an account on Chargebee should result in a customer appearing on the customer list', () => {
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
    cy.contains(E2E.e2eCustomer.email);
    cy.contains(`${E2E.e2eCustomer.firstName} ${E2E.e2eCustomer.surname}`);
  });

  it('Should pick up subscription details on the customer list', () => {
    Customers.visit();
    cy.task('addTestCard', E2E.e2eCustomer.username);
    cy.task('addSubscription', {
      customerId: E2E.e2eCustomer.username,
      planId: 'EQ-1-Monthly-5-2022',
      price: 100,
    });

    Customers.getTableRows()
      .contains(customerNameString)
      .parents('tr')
      .contains('EQ-5');
  });

  it('Should correctly display added subscription details on the edit customer page', () => {
    Customers.visit();
    Customers.clickEditLink(customerNameString);
    EditCustomer.getHeader();
    EditCustomer.getPlansSection()
      .children('div')
      .children()
      .should('have.length', 1);
    EditCustomer.getPlansSection().contains('header', 'Equilibrium');
    EditCustomer.getPlanTableRows(0).eq(0).find('td').contains('5');
    EditCustomer.getPlanTableRows(0).eq(1).find('td').contains('5');
    EditCustomer.getPlanTableRows(0).eq(2).find('td').contains('1');
    EditCustomer.getPlanTableRows(0).eq(3).find('td').contains('No pause');
  });

  it('Deleting a customer on ChargeBee results in a customer vanishing from the list', () => {
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
    Customers.visit();
    Customers.getTable()
      .contains(customerNameString, { timeout: 60_000 })
      .should('not.exist');
  });
});
