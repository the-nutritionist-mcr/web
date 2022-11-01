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

  getHeader: (text: string) => cy.contains('h2', text),

  getEditDialog: () => cy.get('form'),

  editNameField: (text: string) =>
    cy.get('form').find(`input[name='name']`).clear().type(text),

  getEditNameField: () => cy.get('form').find(`input[name='name']`),

  editShortnameField: (text: string) =>
    cy.get('form').find(`input[name='shortName']`).clear().type(text),

  getEditShortnameField: () => cy.get('form').find(`input[name='shortName']`),

  editDescriptionField: (text: string) =>
    cy.get('form').find(`input[name='description']`).clear().type(text),

  getEditDescriptionField: () =>
    cy.get('form').find(`input[name='description']`),

  editServedField: (text: string) => selectFromGrommetDrop('hotOrCold', text),

  getServedField: () => cy.get('form').find(`input[name='hotOrCold']`),

  getAllergensField: () => cy.get('form').find(`input[name='allergens']`),

  editAllergensField: (text: string) =>
    cy.get('form').find(`input[name='allergens']`).clear().type(text),

  getCustomisationsField: () =>
    cy.get('form').find(`input[name='potentialExclusions']`),

  addToCustomisationField: (text: string) => {
    selectFromGrommetDrop('potentialExclusions', text);
  },

  editExclusionsField: (text: string) =>
    selectFromGrommetDrop('invalidExclusions', text),

  getExclusionsField: () =>
    cy.get('form').find(`input[name='invalidExclusions']`),

  clickSave: () => cy.contains('button', 'Save').click({ force: true }),
  clickCancel: () => cy.contains('button', 'Cancel').click({ force: true }),
};
