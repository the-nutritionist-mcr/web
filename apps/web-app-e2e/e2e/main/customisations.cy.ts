import { E2E } from '@tnmw/constants';
import {
  ConfirmDeleteDialog,
  CreateCustomisationsDialog,
  Customisations,
} from '../../src/pages/customisations';

describe('The customisations page', { scrollBehavior: false }, () => {
  before(() => {
    cy.seed();
  });

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

  it('should contain table with 111 rows and a header row', () => {
    Customisations.visit();
    Customisations.getTableRows().should('have.length', 112);
  });

  it('Should pop up a dialog when you click new', () => {
    Customisations.visit();
    Customisations.clickNewButton();
    CreateCustomisationsDialog.getCreateDialog();
  });

  it('Should add an extra row in the recipes table when you fill in the Create Dialog', () => {
    Customisations.visit();
    Customisations.clickNewButton();
    CreateCustomisationsDialog.getCreateDialog();
    CreateCustomisationsDialog.editNameField('some-allergen');
    CreateCustomisationsDialog.editAllergenField(true);
    CreateCustomisationsDialog.clickOk();
    Customisations.getTable().contains('some-allergen');
  });

  it('Added recipe should persist across pageload', () => {
    Customisations.visit();
    Customisations.getTable().contains('some-allergen');
  });

  it('Added customisation should have all its data correctly persisted', () => {
    Customisations.visit();
    Customisations.clickCustomisationEdit('some-allergen');
    Customisations.getNameField().should('have.value', 'some-allergen');
    Customisations.getAllergenField().should('be.checked');
  });

  it('Should persist changes to customisations', () => {
    Customisations.visit();
    Customisations.clickCustomisationEdit('No Balsam');
    CreateCustomisationsDialog.editNameField('Actually Balsam');
    CreateCustomisationsDialog.editAllergenField(true);
    CreateCustomisationsDialog.clickOk();
    Customisations.getTable().contains('Actually Balsam');
    Customisations.visit();
    Customisations.clickCustomisationEdit('Actually Balsam');
    Customisations.getNameField().should('have.value', 'Actually Balsam');
    Customisations.getAllergenField().should('be.checked');
  });

  it('Should remove a row when you click the delete button and confirm', () => {
    Customisations.visit();
    Customisations.clickCustomisationDelete('some-allergen');
    ConfirmDeleteDialog.clickOk();
    Customisations.getTable().contains('some-allergen').should('not.exist');
  });
});
