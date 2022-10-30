export const selectFromGrommetDrop = (fieldName: string, selection: string) => {
  cy.get(`input[name='${fieldName}']`).click({ force: true });
  return cy
    .get('[data-g-portal-id]')
    .find("div[role='listbox']")
    .contains(selection)
    .click({ force: true });
};
