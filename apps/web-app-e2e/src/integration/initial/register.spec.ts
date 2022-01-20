describe("the register page", () => {
  before(() => {
    cy.seed();
  });

  it("Should load a page with a register form", () => {
    cy.visit("/register/");
    cy.get("form").find("button").contains("Register");
  });

  it("Should fail to create a user if the email already exists in the database", () => {});

  it("Should allow you to create a user then redirect you to the login page when it is successful", () => {
    cy.visit("/register/");
    cy.get("form").should("be.visible");

    const registerTestUsername = Cypress.env("CYPRESS_TEST_REGISTER_USER");
    const registerTestEmail = "asd@be.com";
    const registerTestPassword = "123.123.aA";

    cy.get("form")
      .find("input[name='username']")
      .clear()
      .type(registerTestUsername);
    cy.get("form").find("input[name='email']").clear().type(registerTestEmail);
    cy.get("form")
      .find("input[name='password']")
      .clear()
      .type(registerTestPassword);
    cy.get("form")
      .find("input[name='verifyPassword']")
      .clear()
      .type(registerTestPassword);
    cy.get("form").find("input[name='firstName']").clear().type("Cypress");
    cy.get("form").find("input[name='lastName']").clear().type("Jones");
    cy.get("form")
      .find("input[name='telephone']")
      .clear()
      .type("+447872591841");
    cy.get("form")
      .find("input[name='addressLine1']")
      .clear()
      .type("Some address");
    cy.get("form").find("input[name='addressLine2']").clear().type("Somewhere");
    cy.get("form").find("input[name='county']").clear().type("Some county");
    cy.get("form").find("input[name='postcode']").clear().type("Some postcode");
    cy.get("form").find("input[name='townOrCity']").clear().type("Some city");

    cy.get("form").find("button").contains("Register").click();
    cy.contains("please enter the code");

    cy.task("adminConfirmSignup", {
      user: registerTestUsername,
      pool: Cypress.env("CYPRESS_POOL_ID")
    });

    cy.intercept(
      {
        method: "POST",
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp"
        }
      },
      request => {
        request.reply({
          statusCode: 200,
          body: "{}"
        });
      }
    );

    cy.get("form").find("input[name='code']").clear().type("123456");
    cy.get("form").find("button").contains("Submit").click();
    cy.contains("You are logged in");
    cy.location("pathname").should("eq", "/account");
  });
});
