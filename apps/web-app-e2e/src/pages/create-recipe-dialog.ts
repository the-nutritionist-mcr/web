export class CreateRecipeDialog {
  getCreateDialog() {
    return cy.get('form');
  }

  getHeader(text: string) {
    return cy.contains('h2', text);
  }
}
