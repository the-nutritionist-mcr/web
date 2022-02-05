describe('The login page', () => {
  after(() => {
    cy.task('removeTestCustomer');
  });

  it('Should load a page with a login form', () => {
    cy.visit('/login/');
    cy.get('form').find('button').contains('Login');
  });

  it("Should display an error message if the user doesn't exist", () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form').find("input[name='email']").clear().type('a@b.c');
    cy.get('form').find("input[name='password']").clear().type('asdds');
    cy.get('form').find('button').contains('Login').click();
    cy.get('form').contains('User does not exist');
  });

  it('Should display an error message if your password is incorrect', () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form')
      .find("input[name='email']")
      .clear()
      .type(Cypress.env('email'));
    cy.get('form').find("input[name='password']").clear().type('asdsdfasd');
    cy.get('form').find('button').contains('Login').click();
    cy.get('form').contains('Incorrect username or password');
  });

  it('Should ask you to change your password and redirect you to account page when ', () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');

    cy.get('form')
      .find("input[name='email']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_EMAIL'));

    cy.get('form')
      .find("input[name='password']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_USER_INITIAL_PASSWORD'));

    cy.get('form').find('button').contains('Login').click();

    cy.get('p').should(
      'have.text',
      'You need to change your password. Enter a new one in the box below:'
    );
    cy.get('form')
      .get("input[name='password']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_USER_FINAL_PASSWORD'));

    cy.get('form').find('button').contains('Submit').click();

    cy.location('pathname').should('eq', '/account');
  });

  it('Should redirect straight to account page on second login', () => {
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form')
      .find("input[name='email']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_EMAIL'));
    cy.get('form')
      .find("input[name='password']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_USER_FINAL_PASSWORD'));
    cy.get('form').find('button').contains('Login').click();
    cy.location('pathname').should('eq', '/account');
  });

  it('Creating an account on ChargeBee should provide an account that I can log in with', () => {
    cy.task('createChargebeeCustomer');
    cy.visit('/login/');
    cy.get('form').should('be.visible');
    cy.get('form')
      .find("input[name='email']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_EMAIL'));
    cy.get('form')
      .find("input[name='password']")
      .clear()
      .type(Cypress.env('CYPRESS_TEST_USER_FINAL_PASSWORD'));
    cy.get('form').find('button').contains('Login').click();
    cy.location('pathname').should('eq', '/account');

    cy.visit('/login/');
    cy.location('pathname').should('eq', '/account');
  });
});
