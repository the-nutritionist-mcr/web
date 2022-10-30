import { E2E } from '@tnmw/constants';
import {
  Recipes,
  CreateRecipeDialog,
  ConfirmDeleteDialog,
} from '../../src/pages/recipes';

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

  it('should contain a table with 215 rows of data and a header row', () => {
    Recipes.visit();
    Recipes.getTableRows().should('have.length', 216);
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
    Recipes.getTable().contains('tuna-b');
  });

  it('Added recipe should persist across pageload', () => {
    Recipes.visit();
    Recipes.getTable().contains('tuna-b');
  });

  it('Added recipe should have all its data correctly persisted', () => {
    Recipes.visit();
    Recipes.clickRecipeEdit('tuna-b');
    CreateRecipeDialog.getEditNameField().should('have.value', 'Tuna Bake');
    CreateRecipeDialog.getEditShortnameField().should('have.value', 'tuna-b');
    CreateRecipeDialog.getEditDescriptionField().should(
      'have.value',
      'A delicious tuna bake'
    );
  });

  it('Should remove a row when you click the delete button and confirm', () => {
    Recipes.visit();
    Recipes.clickRecipeDelete('tuna-b');
    ConfirmDeleteDialog.clickOk();
    Recipes.getTable().contains('tuna-b').should('not.exist');
  });

  it('Removed recipe should persist across pageload', () => {
    Recipes.visit();
    Recipes.getTable().contains('tuna-b').should('not.exist');
  });
});
