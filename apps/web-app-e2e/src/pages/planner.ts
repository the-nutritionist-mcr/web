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
