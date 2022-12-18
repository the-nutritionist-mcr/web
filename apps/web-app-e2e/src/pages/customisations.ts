export const Customisations = {
  visit: () => {
    cy.visit('/admin/customisations');
  },

  getHeader: () => cy.contains('h2', 'Customisations'),
  getTable: () => cy.get('table'),

  getTableRows: () => cy.get('table').find('tr'),

  clickNewButton: () => cy.contains('button', 'New').click(),
  getNameField: () => cy.get('form').find(`input[name='name']`),
  getAllergenField: () => cy.get('form').find(`input[name='allergen']`),

  clickCustomisationDelete: (name: string) => {
    cy.contains(name)
      .parent('tr')
      .find('button[aria-label="Delete"]')
      .click({ force: true });
  },

  clickCustomisationEdit: (name: string) =>
    cy
      .contains(name)
      .parent('tr')
      .find('button[aria-label="Edit"]')
      .click({ force: true }),
};

export const ConfirmDeleteDialog = {
  clickOk: () => {
    cy.contains('button', 'Ok').click();
    cy.contains('successfully');
  },
  clickCancel: () => cy.contains('button', 'Cancel').click(),
};

export const CreateCustomisationsDialog = {
  getCreateDialog: () => cy.get('form'),

  editNameField: (text: string) =>
    cy.get('form').find(`input[name='name']`).clear().type(text),

  editAllergenField: (isAllergen: boolean) => {
    return isAllergen
      ? cy.get('form').find(`input[name='allergen']`).check({ force: true })
      : cy.get('form').find(`input[name='allergen']`).uncheck({ force: true });
  },

  clickOk: () => {
    cy.get('form').contains('button', 'Ok').click({ force: true });
    cy.contains('successfully');
  },
};
