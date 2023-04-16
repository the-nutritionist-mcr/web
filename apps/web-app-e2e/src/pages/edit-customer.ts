export const EditCustomer = {
  visit: (id: string) => {
    cy.visit(`/admin/edit-customer/?userId=${id}`);
  },
  getHeader: () => {
    return cy.contains('h2', 'Update Customer');
  },

  getPlansTable: () => {
    return cy.contains('table', 'Plan');
  },

  getPlanTableRows: (index: number) => {
    return cy
      .contains('h3', 'Plans')
      .parent('div')
      .children('div')
      .children()
      .eq(index)
      .find('table')
      .find('tr');
  },

  getPlansSection: () => {
    return cy.contains('h3', 'Plans').parent('div');
  },

  getPlansTableRows: () => {
    return cy.contains('table', 'Plan').find('tr');
  },

  resetPassword: (forceChange: boolean, password?: string) => {
    cy.contains('button', 'Reset Password').click();
    if (password) {
      cy.get('input[name="password"]').clear();
      cy.get('input[name="password"]').type(password);
    }

    if (forceChange) {
      cy.get('input[name="force"]').click();
    }

    cy.contains('button', 'Ok').click();
    cy.contains('successfully');
  },
};
