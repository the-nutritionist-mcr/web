export const AccountPage = {
  isInNavbar: () => cy.location('pathname').should('eq', '/account/'),
};
