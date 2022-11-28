export const Customers = {
  visit: () => {
    cy.visit('/admin/customers');
  },

  getHeader: () => {
    cy.contains('h2', 'Customers');
  },

  getTable: () => cy.get('table'),
  getTableRows: () => cy.get('table').find('tr'),

  clickEditLink: (name: string, timeout?: number) =>
    cy
      .get('table')
      .contains('a', name, { timeout: timeout ?? 30_000 })
      .click(),
};
