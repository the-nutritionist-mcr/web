/* eslint-disable unicorn/no-array-callback-reference */
import { selectFromGrommetDrop } from '../support/cypress-helpers';

const monthDiff = (dateFrom: Date, dateTo: Date) =>
  dateTo.getMonth() -
  dateFrom.getMonth() +
  12 * (dateTo.getFullYear() - dateFrom.getFullYear());

const months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const selectFromDatePicker = (targetDate: Date) => {
  return cy.get('[data-g-portal-id]').within(() => {
    cy.get('h3').then((header) => {
      const parts = header.text().split(' ');
      const month = months[parts[0].trim()];
      const year = Number.parseInt(parts[1].trim(), 10);

      const currentDate = new Date();

      currentDate.setMonth(month);
      currentDate.setFullYear(year);
      const difference = monthDiff(currentDate, targetDate);

      const nextOrPrevious = difference > 0 ? 'Next' : 'Previous';

      [...Array.from({ length: Math.abs(difference) })].forEach(() => {
        cy.get(`[aria-label='${nextOrPrevious}']`).click();
      });

      Cypress.log({
        message: [targetDate.getDate()],
      });

      cy.get('button').contains(targetDate.getDate()).click();
    });
  });
};

export const Recipes = {
  visit: () => cy.visit('/admin/recipes'),

  getHeader: () => cy.contains('h2', 'Recipes'),

  getTable: () => cy.get('table'),

  clickPlanningMode: () => cy.contains('button', 'Planning Mode').click(),

  clickSendToPlanner: () => cy.contains('button', 'Send to Planner').click(),

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

  chooseCookDateSelect: (which: number, date: Date) => {
    cy.contains(`Cook ${which}`)
      .parent('header')
      .parent('div')
      .find('svg')
      .parent('button')
      .click();

    selectFromDatePicker(date);
  },

  clickPickMeals: (which: number) =>
    cy
      .contains(`Cook ${which}`)
      .parent('header')
      .parent('div')
      .contains('button', 'Pick Meals')
      .click(),

  addRecipeToSelectedCook: (shortName: string) =>
    cy.contains(shortName).parents('tr').find('input').parent().click(),
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
