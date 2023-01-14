import { E2E } from '@tnmw/constants';
import { Recipes, CreateRecipeDialog } from '../../src/pages/recipes';
import { ConfirmDeleteDialog } from '../../src/pages/confirm-delete-dialog';

const recipes = new Recipes();
const confirmDeleteDialog = new ConfirmDeleteDialog();

describe('The recipes page', { scrollBehavior: false }, () => {
  before(() => {
    cy.seed();
  });

  // eslint-disable-next-line fp/no-let
  let timeout: NodeJS.Timeout | undefined;
  beforeEach(() => {
    timeout = setTimeout(() => {
      throw new Error('Timed out');
    }, 10 * 60_000);

    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
  });

  afterEach(() => {
    clearTimeout(timeout);
  });

  it("Should load a page titled 'recipes'", () => {
    recipes.visit();
    recipes.getHeader();
  });

  it('should contain a table with 215 rows of data and a header row', () => {
    recipes.visit();
    recipes.getTableRows().should('have.length', 216);

    recipes
      .getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(0)
      .contains('TERIYAKI SAL');

    recipes
      .getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(1)
      .contains('TERIYAKI GLAZED SALMON');

    recipes
      .getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(2)
      .contains(
        'Fragrant jasmine rice, sriracha dressed slaw, toasted peanuts, spring onions, chilli coriander dressing'
      );

    recipes
      .getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(3)
      .contains('Extra Meat');

    recipes
      .getTableRows()
      .contains('TERIYAKI SAL')
      .parent('tr')
      .find('td')
      .eq(3)
      .contains('No Brocc');

    clearTimeout(timeout);
  });

  it('Should pop up a dialog when you click new', () => {
    recipes.visit();
    recipes.getNewButton().click();
    CreateRecipeDialog.getCreateDialog();
  });

  it('Should add an extra row in the recipes table when you fill in the Create Dialog', () => {
    recipes.visit();
    recipes.getNewButton().click();
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
    recipes.getTable().contains('tuna-b');
  });

  it('Added recipe should persist across pageload', () => {
    recipes.visit();
    recipes.getTable().contains('tuna-b');
  });

  it('Added recipe should have all its data correctly persisted', () => {
    recipes.visit();
    recipes.getRecipeEdit('tuna-b').click({ force: true });

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
    recipes.visit();
    recipes.getRecipeEdit('7 SPICE CHIX').click();
    CreateRecipeDialog.editNameField('A different kind of recipe');
    CreateRecipeDialog.editShortnameField('8 SPICE CHIX');
    CreateRecipeDialog.editDescriptionField('A description');
    CreateRecipeDialog.editServedField('Cold');
    CreateRecipeDialog.editAllergensField('Has allergens');
    CreateRecipeDialog.addToCustomisationField('No Brocc');
    CreateRecipeDialog.editExclusionsField('No Alcohol');
    CreateRecipeDialog.clickSave();
    recipes.visit();
    recipes.getTable().contains('8 SPICE CHIX');
    recipes.visit();
    recipes.getRecipeEdit('8 SPICE CHIX').click();
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
    recipes.visit();
    recipes.getRecipeDelete('tuna-b').click({ force: true });
    confirmDeleteDialog.getOkButton().click();
    recipes.getTable().contains('tuna-b').should('not.exist');
  });

  it('Removed recipe should persist across pageload', () => {
    recipes.visit();
    recipes.getTable().contains('tuna-b').should('not.exist');
  });
});
