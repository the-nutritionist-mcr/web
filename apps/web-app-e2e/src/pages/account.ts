export const AccountPage = {
  visit: () => cy.visit('/account/'),
  isInNavbar: () => cy.location('pathname').should('eq', '/account/'),
  getYourDetailsHeader: () => cy.contains('h2', 'Your Details'),
  getFirstNameField: () => cy.get('input[name="firstName"]'),
  getSurnameField: () => cy.get('input[name="surname"]'),
  getPhonenumberField: () => cy.get('input[name="phoneNumber"]'),
  getAddress1Field: () => cy.get('input[name="addressLine1"]'),
  getAddress2Field: () => cy.get('input[name="addressLine2"]'),
  getCountryField: () => cy.get('input[name="country"]'),
  getPostcodeField: () => cy.get('input[name="postcode"]'),
  getCityField: () => cy.get('input[name="city"]'),
};
