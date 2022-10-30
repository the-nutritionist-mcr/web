import { selectFromGrommetDrop } from '../support/cypress-helpers';

export const Recipes = {
  visit: () => cy.visit('/admin/recipes'),

  getHeader: () => cy.contains('h2', 'Recipes'),

  getTable: () => cy.get('table'),

  getTableRows: () => cy.get('table').find('tr'),

  clickNewButton: () => cy.contains('button', 'New').click(),

  getCreateRecipeHeader: () => cy.contains('h3', 'Create Recipe'),
};

export const CreateRecipeDialog = {
  getDialog: () => cy.contains('h3', 'Create Recipe').parentsUntil('form'),

  editNameField: (text: string) =>
    cy.get('form').find(`input[name='name']`).type(text),

  editShortnameField: (text: string) =>
    cy.get('form').find(`input[name='shortName']`).type(text),

  editDescriptionField: (text: string) =>
    cy.get('form').find(`input[name='description']`).type(text),

  editServedField: (text: string) => selectFromGrommetDrop('hotOrCold', text),

  editAllergensField: (text: string) =>
    cy.get('form').find(`input[name='allergens']`).type(text),

  addToCustomisationField: (text: string) => {
    cy.get('form').contains('button', 'Add').click();
    cy.get('[data-g-portal-id]')
      .find("div[role='listbox']")
      .contains(text)
      .click({ force: true });
  },

  editExclusionsField: (text: string) =>
    selectFromGrommetDrop('invalidExclusions', text),

  clickOk: () => cy.contains('button', 'Ok').click(),
  clickCancel: () => cy.contains('button', 'Cancel').click(),
};
