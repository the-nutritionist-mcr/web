export const Planner = {
  visit: () => {
    cy.visit('/admin/planner/');
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
