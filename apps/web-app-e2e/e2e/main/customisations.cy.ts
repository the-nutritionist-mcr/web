import { E2E } from '@tnmw/constants';
import { Customisations } from '../../src/pages/customisations';

describe('The customisations page', { scrollBehavior: false }, () => {
  beforeEach(() => {
    Customisations.visit();

    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
  });

  it("Should load a page titled 'customisations'", () => {
    Customisations.visit();
    Customisations.getHeader();
  });
});
