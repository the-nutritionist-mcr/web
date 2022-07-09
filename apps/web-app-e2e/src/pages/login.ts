export const LoginPage = {
  visit: () => {
    cy.visit('/login/');
  },

  getLoginForm: () => cy.get('form'),

  getLoginButton: () => cy.get('form').find('button').contains('Login'),

  getSubmitButton: () => cy.get('form').find('button').contains('Submit'),

  clickSubmitButton: () =>
    cy.get('form').find('button').contains('Submit').click(),

  clickLoginButton: () =>
    cy.get('form').find('button').contains('Login').click(),

  fillEmailInput: (text: string) =>
    cy.get('form').find("input[name='email']").clear().type(text),

  getEmailInput: () => cy.get('form').find("input[name='email']"),

  getPasswordInput: () => cy.get('form').find("input[name='password']"),

  fillPasswordInput: (text: string) =>
    cy.get('form').find("input[name='password']").clear().type(text),
};
