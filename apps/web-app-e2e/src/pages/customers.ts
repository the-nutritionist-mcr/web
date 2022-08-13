export const Customers = {
  visit: () => {
    cy.visit('/admin/customers');
  },

  getHeader: () => {
    cy.contains('h2', 'Customers');
  },
};
