export const EditCustomer = {
  visit: (id: string) => {
    cy.visit(`/admin/edit-customer/?userId=${id}`);
  },
  getHeader: () => {
    cy.contains('h2', 'Update Customer');
  },
};
