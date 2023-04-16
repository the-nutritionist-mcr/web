export const LoginPage = {
  visit: () => {
    cy.visit('/login/');
  },

  getLoginForm: () => cy.get('form'),

  getLoginButton: () => cy.contains('form button', 'Login'),

  getSubmitButton: () => cy.contains('form button', 'Submit'),

  clickSubmitButton: () => cy.contains('form button', 'Submit').click(),

  clickLoginButton: () => cy.contains('form button', 'Login').click(),

  fillEmailInput: (text: string) => {
    cy.get('form').find("input[name='email']").clear();
    cy.get('form').find("input[name='email']").type(text);
  },

  getEmailInput: () => cy.get('form').find("input[name='email']"),

  getPasswordInput: () => cy.get('form').find("input[name='password']"),

  fillPasswordInput: (text: string) => {
    cy.get('form').find("input[name='password']").clear();
    cy.get('form').find("input[name='password']").type(text);
  },
};
