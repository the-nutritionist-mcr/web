// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';

export const selectFromGrommetDrop = (fieldName: string, selection: string) => {
  cy.get(`input[name='${fieldName}']`).click({ force: true });
  return cy
    .get('[data-g-portal-id]')
    .find("div[role='listbox']")
    .contains(selection)
    .click({ force: true });
};

export const getDownloadedFilename = (name: string) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  return path.join(downloadsFolder, name);
};

export const readDownloadedFile = (name: string) => {
  const downloadedFilename = getDownloadedFilename(name);
  return cy.readFile(downloadedFilename, 'binary', { timeout: 15_000 });
};
