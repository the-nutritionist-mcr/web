import { E2E } from '@tnmw/constants';
import { Planner } from '../../src/pages/planner';
import { Recipes } from '../../src/pages/recipes';
import { Customers } from '../../src/pages/customers';
import { EditCustomer } from '../../src/pages/edit-customer';

const customerNameString = `${E2E.e2eCustomer.surname}, ${E2E.e2eCustomer.firstName}`;
const notReversedName = `${E2E.e2eCustomer.firstName}`;

describe('The planner', () => {
  before(() => {
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
    cy.task('deleteCognitoUser', E2E.e2eCustomer.username);
  });

  beforeEach(() => {
    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
    // cy.clock(Date.UTC(2022, 13, 1));
  });

  it('You can generate a plan on the recipes page that is then available on the planner', () => {
    const user = {
      username: E2E.e2eCustomer.username,
      country: 'England',
      deliveryDay1: E2E.e2eCustomer.deliveryDay1,
      deliveryDay2: E2E.e2eCustomer.deliveryDay2,
      addressLine1: E2E.e2eCustomer.addressLine1,
      addressLine2: E2E.e2eCustomer.addressLine2,
      phoneNumber: E2E.e2eCustomer.phoneNumber,
      addressLine3: E2E.e2eCustomer.addressLine3,
      firstName: E2E.e2eCustomer.firstName,
      surname: E2E.e2eCustomer.surname,
      email: E2E.e2eCustomer.email,
      city: E2E.e2eCustomer.city,
      postcode: E2E.e2eCustomer.postcode,
    };

    cy.task('createChargebeeCustomer', user);

    Customers.visit();
    Customers.getTable().contains(customerNameString, { timeout: 60_000 });

    cy.task('addTestCard', E2E.e2eCustomer.username);
    cy.task('addSubscription', {
      customerId: E2E.e2eCustomer.username,
      planId: 'EQ-1-Monthly-5-2022',
      price: 100,
    });

    Customers.getTableRows()
      .contains(customerNameString)
      .parents('tr')
      .contains('EQ-5');

    Recipes.visit();
    Recipes.getHeader();
    Recipes.clickPlanningMode();
    cy.clock(Date.UTC(2022, 10, 8)).then((clock) => {
      Recipes.clickPickMeals(1);
      Recipes.addRecipeToSelectedCook('PAD THAI');
      Recipes.addRecipeToSelectedCook('ANCHO BBQ CHIX');
      Recipes.addRecipeToSelectedCook('ACHIOTE PORK');
      Recipes.addRecipeToSelectedCook('RICOTTA');
      Recipes.addRecipeToSelectedCook('BUDDHA BOWL');
      Recipes.addRecipeToSelectedCook('SAGE RISO');
      Recipes.chooseCookDateSelect(1, new Date(Date.UTC(2022, 10, 13)));

      Recipes.clickPickMeals(2);
      Recipes.addRecipeToSelectedCook('CHIX ORZO');
      Recipes.addRecipeToSelectedCook('BEEF BURRITO');
      Recipes.addRecipeToSelectedCook('TERIYAKI SAL');
      Recipes.addRecipeToSelectedCook('CHIX ANCHO');
      Recipes.addRecipeToSelectedCook('SAL HOI SIN');
      Recipes.addRecipeToSelectedCook('GOAT NUT SAL');
      Recipes.chooseCookDateSelect(2, new Date(Date.UTC(2022, 10, 16)));

      Recipes.clickSendToPlanner();
      cy.contains('New plan successfully generated!');
      clock.restore();
      Planner.visit();

      cy.contains('Plan generated Today by Cypress Tester');
      cy.contains('This plan has not been published to customers');
    });
  });

  it('Customers with an active plan get the correct selection of meals generated for them on the planner', () => {
    Planner.visit();

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 0).contains(
      'TORN CHILLI CHICKEN'
    );

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 1).contains(
      'ANCHO CHILLI BARBECUE PULLED CHICKEN'
    );

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 2).contains(
      'ACHIOTE SLOW COOKED SHOULDER OF PORK'
    );

    Planner.getPlanRowCell(notReversedName, 2, 'Equilibrium', 0).contains(
      'LEMON + HERB ROAST CHICKEN ORZO'
    );

    Planner.getPlanRowCell(notReversedName, 2, 'Equilibrium', 1).contains(
      'SLOW COOKED BEEF BURRITO BOWL'
    );
  });

  it('Clicking on the customers name takes you to the edit customer page', () => {
    Planner.visit();
    Planner.clickCustomerName('Ben Wainwright');
    EditCustomer.getHeader();
    cy.contains('Ben Wainwright');
  });

  it('For meal plan rows, you can click on the individual recipe entry to change to a different one', () => {
    Planner.visit();
    Planner.changePlanEntry(
      notReversedName,
      1,
      'Equilibrium',
      'TORN CHILLI CHICKEN',
      'BUDDHA BOWL'
    );

    Planner.getPlanRow(notReversedName, 1, 'Equilibrium')
      .parents('tr')
      .find('td')
      .eq(1)
      .contains('BUDDHA BOWL');
  });

  it('When you change individual plan items, it does not override previous changes', () => {
    Planner.visit();
    Planner.changePlanEntry(
      notReversedName,
      1,
      'Equilibrium',
      'BUDDHA BOWL',
      'BABY SPINACH'
    );

    Planner.changePlanEntry(
      notReversedName,
      1,
      'Equilibrium',
      'ANCHO CHILLI',
      'BUDDHA BOWL'
    );

    Planner.getPlanRow(notReversedName, 1, 'Equilibrium')
      .parents('tr')
      .find('td')
      .eq(1)
      .contains('BABY SPINACH');

    Planner.getPlanRow(notReversedName, 1, 'Equilibrium')
      .parents('tr')
      .find('td')
      .eq(2)
      .contains('BUDDHA BOWL');
  });

  it('Clicking the small trash button removes individual recipe entries', () => {
    Planner.visit();
    Planner.deletePlanEntry(notReversedName, 1, 'Equilibrium', 1);

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 0).contains(
      'GRATIN'
    );

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 1).contains(
      'SHOULDER OF PORK'
    );
  });

  it.skip('Clicking on the large trash button removes the row');

  it.skip(
    'The add plan row button provides a mechanism to add a row to a customers plan'
  );

  it.skip(
    'When extras rows are added, there is no way of changing the individual option'
  );

  it.skip(
    'If a customer is paused on the day of the cook, then no meals are chosen for them'
  );

  it.skip('Clicking the plus button adds a recipe to the row');

  it.skip('The pack plan button downloads a PDF');

  it.skip('The pack plan PDF has a page for each cook');

  it.skip('The pack plan correctly marks recipes with customisations');

  it.skip('The pack plan correctly swaps out any alternates');

  it.skip('The planner correctly swaps out any alternates');
});