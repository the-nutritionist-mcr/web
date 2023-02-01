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
        cy.get(`[aria-label='${nextOrPrevious}']`).click({ force: true });
      });

      Cypress.log({
        message: [targetDate.getDate()],
      });

      cy.get('button').contains(targetDate.getDate()).click({ force: true });
    });
  });
};

export class Recipes {
  visit() {
    return cy.visit('/admin/recipes');
  }

  getHeader() {
    return cy.contains('h2', 'Recipes');
  }

  getTable() {
    return cy.get('table');
  }

  getPlanningModeButton() {
    return cy.contains('button', 'Planning Mode');
  }

  getSendToPlannerButton() {
    return cy.contains('button', 'Send to Planner');
  }

  getTableRows() {
    return cy.get('table').find('tr');
  }

  getNewButton() {
    return cy.contains('button', 'New');
  }

  getRecipeEdit(shortName: string) {
    return cy
      .contains(shortName)
      .parent('tr')
      .find('button[aria-label="Edit"]');
  }

  getRecipeDelete(shortName: string) {
    return cy
      .contains(shortName)
      .parent('tr')
      .find('button[aria-label="Delete"]');
  }

  getCreateRecipeHeader() {
    return cy.contains('h3', 'Create Recipe');
  }

  selectChooseCookDate(which: number, date: Date) {
    cy.contains(`Cook ${which}`)
      .parent('header')
      .parent('div')
      .find('svg')
      .parent('button')
      .click({ force: true });

    selectFromDatePicker(date);
  }

  getPickMealsButton(which: number) {
    return cy
      .contains(`Cook ${which}`)
      .parent('header')
      .parent('div')
      .contains('button', 'Pick Meals');
  }

  getAddRecipeToCookCheckbox(shortName: string) {
    return cy.contains(shortName).parents('tr').find('input').parent();
  }
}

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

  clickSave: () => {
    cy.contains('button', 'Save').click({ force: true });
    cy.contains('successfully');
  },
  clickCancel: () => cy.contains('button', 'Cancel').click({ force: true }),
};
