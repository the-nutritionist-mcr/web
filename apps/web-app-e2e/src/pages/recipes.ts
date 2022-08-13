export const Recipes = {
  visit: () => {
    cy.visit('/admin/recipes');
  },

  getHeader: () => {
    cy.contains('h2', 'Recipes');
  },
};
