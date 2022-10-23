import { E2E } from '@tnmw/constants';
import { Recipes, CreateRecipeDialog } from '../../src/pages/recipes';

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

  it('should contain a table with more than one row of data', () => {
    Recipes.visit();
    Recipes.getTableRows().should('have.length.gt', 1);
  });

  it('Should pop up a dialog when you click new', () => {
    Recipes.visit();
    Recipes.clickNewButton();
    CreateRecipeDialog.getDialog();
  });

  it('Should add an extra row in the recipes table when you fill in the Create Dialog', () => {
    Recipes.visit();
    Recipes.clickNewButton();
    CreateRecipeDialog.getDialog();
    CreateRecipeDialog.editNameField('Tuna Bake');
    CreateRecipeDialog.editShortnameField('tuna-b');
    CreateRecipeDialog.editDescriptionField('A delicious tuna bake');
    CreateRecipeDialog.editServedField('Cold');
    CreateRecipeDialog.editAllergensField('Cheese');
    CreateRecipeDialog.addToCustomisationField('Extra Veg');
    CreateRecipeDialog.addToCustomisationField('No Alcohol');
    CreateRecipeDialog.editExclusionsField('No Brocc');
    CreateRecipeDialog.clickOk();
    Recipes.getTableRows().contains('tuna-b');
  });
});
