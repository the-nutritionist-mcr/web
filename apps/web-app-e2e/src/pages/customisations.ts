export const Customisations = {
  visit: () => {
    cy.visit('/admin/customisations');
  },

  getHeader: () => {
    cy.contains('h2', 'Customisations');
  },
};
