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

    Recipes.getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(0)
      .contains('TERIYAKI SAL');

    Recipes.getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(1)
      .contains('TERIYAKI GLAZED SALMON');

    Recipes.getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(2)
      .contains(
        'Fragrant jasmine rice, sriracha dressed slaw, toasted peanuts, spring onions, chilli coriander dressing'
      );

    Recipes.getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(3)
      .contains('Extra Meat');

    Recipes.getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(3)
      .contains('No Brocc');
  });

  it('Should pop up a dialog when you click new', () => {
    Recipes.visit();
    Recipes.clickNewButton();
    CreateRecipeDialog.getCreateDialog();
  });

  it('Should add an extra row in the recipes table when you fill in the Create Dialog', () => {
    Recipes.visit();
    Recipes.clickNewButton();
    CreateRecipeDialog.getCreateDialog();
    CreateRecipeDialog.editNameField('Tuna Bake');
    CreateRecipeDialog.editShortnameField('tuna-b');
    CreateRecipeDialog.editDescriptionField('A delicious tuna bake');
    CreateRecipeDialog.editServedField('Cold');
    CreateRecipeDialog.editAllergensField('Cheese');
    CreateRecipeDialog.addToCustomisationField('Extra Veg');
    CreateRecipeDialog.getHeader('Create Recipe').click();
    CreateRecipeDialog.addToCustomisationField('No Alcohol');
    CreateRecipeDialog.getHeader('Create Recipe').click();
    CreateRecipeDialog.editExclusionsField('No Brocc');
    CreateRecipeDialog.getHeader('Create Recipe').click();
    CreateRecipeDialog.clickSave();
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
    CreateRecipeDialog.getServedField().should('have.value', 'Cold');
    CreateRecipeDialog.getAllergensField().should('have.value', 'Cheese');
    CreateRecipeDialog.getExclusionsField().should('have.value', 'No Brocc');
    CreateRecipeDialog.getCustomisationsField().should(
      'have.value',
      'multiple'
    );
  });

  it('Should persist changes to recipes', () => {
    Recipes.visit();
    Recipes.clickRecipeEdit('7 SPICE CHIX');
    CreateRecipeDialog.editNameField('A different kind of recipe');
    CreateRecipeDialog.editShortnameField('8 SPICE CHIX');
    CreateRecipeDialog.editDescriptionField('A description');
    CreateRecipeDialog.editServedField('Cold');
    CreateRecipeDialog.editAllergensField('Has allergens');
    CreateRecipeDialog.addToCustomisationField('No Brocc');
    CreateRecipeDialog.editExclusionsField('No Alcohol');
    CreateRecipeDialog.clickSave();
    Recipes.getTable().contains('8 SPICE CHIX');
    Recipes.visit();
    Recipes.clickRecipeEdit('8 SPICE CHIX');
    CreateRecipeDialog.getEditNameField().should(
      'have.value',
      'A different kind of recipe'
    );
    CreateRecipeDialog.getEditShortnameField().should(
      'have.value',
      '8 SPICE CHIX'
    );
    CreateRecipeDialog.getEditDescriptionField().should(
      'have.value',
      'A description'
    );
    CreateRecipeDialog.getServedField().should('have.value', 'Cold');
    CreateRecipeDialog.getAllergensField().should(
      'have.value',
      'Has allergens'
    );
    CreateRecipeDialog.getCustomisationsField().should(
      'have.value',
      'multiple'
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
