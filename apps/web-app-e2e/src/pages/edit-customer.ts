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

  getPlansTableRows: () => {
    return cy.contains('table', 'Plan').find('tr');
  },
};
