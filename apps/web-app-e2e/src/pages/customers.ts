export const Customers = {
  visit: () => {
    cy.visit('/admin/customers');
  },

  getHeader: () => {
    cy.contains('h2', 'Customers');
  },

  getTable: () => cy.get('table'),

  clickEditLink: (text: string) => cy.get('table').contains('a', text).click(),
};
