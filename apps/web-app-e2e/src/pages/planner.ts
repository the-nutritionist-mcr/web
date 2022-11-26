import { selectFromGrommetDrop } from '../support/cypress-helpers';

export const Planner = {
  visit: () => {
    cy.visit('/admin/planner/');
  },

  clickPublish: () => {
    cy.contains('button', 'Publish').click();
    cy.contains('successfully');
  },

  getDownloadLabelDataButton: () => {
    return cy.contains('button', 'Download Label Data');
  },

  getPackPlanButton: () => {
    return cy.contains('button', 'Pack Plan');
  },

  getCookPlanButton: () => {
    return cy.contains('button', 'Cook Plan');
  },

  clickPackPlanButton: () => {
    return cy.contains('button', 'Pack Plan').click();
  },

  clickCookPlanButton: () => {
    return cy.contains('button', 'Cook Plan').click();
  },

  getCustomerRowTable: (name: string) => {
    return cy.contains(name).parents('table');
  },

  clickCustomerName: (name: string) => {
    return cy.contains(name).click();
  },

  changePlanEntry: (
    customerName: string,
    deliveryNumber: number,
    planName: string,
    oldMeal: string,
    newMeal: string
  ) => {
    cy.contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`)
      .parents('tr')
      .contains(oldMeal)
      .click();

    cy.contains(newMeal).click();
    cy.contains('successfully');
  },

  deletePlanEntry: (
    customerName: string,
    deliveryNumber: number,
    planName: string,
    deliveryIndex: number
  ) => {
    cy.contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`)
      .parents('tr')
      .find('td')
      .eq(deliveryIndex + 1)
      .find('button[aria-label=Delete]')
      .click();

    cy.contains('successfully');
  },

  getPlanRow: (
    customerName: string,
    deliveryNumber: number,
    planName: string
  ) => {
    return cy
      .contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`);
  },

  deleteDeliveryRow: (
    customerName: string,
    deliveryNumber: number,
    planName: string
  ) => {
    cy.contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`)
      .parents('tr')
      .find('button[aria-label="Delete Row"]')
      .click();

    cy.contains('successfully');
  },

  addToPlan: (
    customerName: string,
    deliveryNumber: number,
    planName: string
  ) => {
    cy.contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`)
      .parents('tr')
      .find('button[aria-label="Add Meal"]')
      .click();

    cy.contains('successfully');
  },

  addPlanRow: (
    customerName: string,
    deliveryNumber: number,
    planName: string
  ) => {
    cy.contains(customerName)
      .parents('table')
      .contains('button', 'Add Plan Row')
      .click();

    selectFromGrommetDrop('plan', planName);
    selectFromGrommetDrop('delivery', String(deliveryNumber));
    cy.contains('button', 'save').click();

    cy.contains('successfully');
  },

  getPlanRowCell: (
    customerName: string,
    deliveryNumber: number,
    planName: string,
    rowNumber: number
  ) => {
    return cy
      .contains(customerName)
      .parents('table')
      .contains(`D${deliveryNumber} (${planName})`)
      .parents('tr')
      .find('td')
      .eq(rowNumber + 1);
  },
};
