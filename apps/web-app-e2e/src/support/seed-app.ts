export const seed = () => {
  return cy.request({
    method: 'POST',
    url: 'https://api.cypress.app.thenutritionistmcr.com/seed',
  });
};
