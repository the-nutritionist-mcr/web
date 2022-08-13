import { E2E } from '@tnmw/constants';
import { Recipes } from '../../src/pages/recipes';

describe('The recipes page', { scrollBehavior: false }, () => {
  beforeEach(() => {
    Recipes.visit();

    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
  });

  it("Should load a page titled 'recipes'", () => {
    Recipes.visit();

    Recipes.getHeader();
  });
});
