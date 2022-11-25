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
};
