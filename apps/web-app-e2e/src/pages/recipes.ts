/* eslint-disable unicorn/no-array-callback-reference */
import { selectFromGrommetDrop } from '../support/cypress-helpers';

export const Recipes = {
  visit: () => cy.visit('/admin/recipes'),

  getHeader: () => cy.contains('h2', 'Recipes'),

  getTable: () => cy.get('table'),

  getTableRows: () => cy.get('table').find('tr'),

  clickNewButton: () => cy.contains('button', 'New').click(),

  clickRecipeDelete: (shortName: string) =>
    cy
      .contains(shortName)
      .parent('tr')
      .find('button[aria-label="Delete"]')
      .click({ force: true }),

  clickRecipeEdit: (shortName: string) =>
    cy
      .contains(shortName)
      .parent('tr')
      .find('button[aria-label="Edit"]')
      .click({ force: true }),

  getCreateRecipeHeader: () => cy.contains('h3', 'Create Recipe'),
};

export const ConfirmDeleteDialog = {
  clickOk: () => cy.contains('button', 'Ok').click(),
  clickCancel: () => cy.contains('button', 'Cancel').click(),
};

export const CreateRecipeDialog = {
  getCreateDialog: () => cy.get('form'),

  getEditDialog: () => cy.get('form'),

  editNameField: (text: string) =>
    cy.get('form').find(`input[name='name']`).type(text),

  getEditNameField: () => cy.get('form').find(`input[name='name']`),

  editShortnameField: (text: string) =>
    cy.get('form').find(`input[name='shortName']`).type(text),

  getEditShortnameField: () => cy.get('form').find(`input[name='shortName']`),

  editDescriptionField: (text: string) =>
    cy.get('form').find(`input[name='description']`).type(text),

  getEditDescriptionField: () =>
    cy.get('form').find(`input[name='description']`),

  editServedField: (text: string) => selectFromGrommetDrop('hotOrCold', text),

  getServedField: () => cy.get('form').find(`input[name='hotOrCold']`),

  getAllergensField: () => cy.get('form').find(`input[name='allergens']`),

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
