import { E2E } from '@tnmw/constants';
import { Customers } from '../../src/pages/customers';

describe('The customers page', { scrollBehavior: false }, () => {
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
});
