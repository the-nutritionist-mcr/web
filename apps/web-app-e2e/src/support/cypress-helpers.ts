export const selectFromGrommetDrop = (fieldName: string, selection: string) => {
  cy.get(`input[name='${fieldName}']`).click();
  return cy
    .get('[data-g-portal-id]')
    .find("div[role='listbox']")
    .contains(selection)
    .click({ force: true });
};
