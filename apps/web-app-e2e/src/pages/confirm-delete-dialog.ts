export class ConfirmDeleteDialog {
  getOkButton() {
    return cy.contains('button', 'Ok');
  }

  getCancelButton() {
    cy.contains('button', 'Cancel');
  }
}
