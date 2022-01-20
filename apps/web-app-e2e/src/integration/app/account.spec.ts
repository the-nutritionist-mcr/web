describe("The account page", () => {
  before(() => {
    cy.seed();
  });

  describe("when logged out", () => {
    it("should redirect you to login page", () => {
      cy.visit("/account/");
      cy.location("pathname").should("eq", "/login");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      cy.loginByCognitoApi(
        Cypress.env("CYPRESS_INT_TEST_EMAIL"),
        Cypress.env("CYPRESS_INT_TEST_PASSWORD")
      );
    });

    it("should not redirect you away and should display its content", () => {
      cy.visit("/account");
      cy.location("pathname").should("eq", "/account");
      cy.get("h2").contains("You are logged in");
    });
  });
});
