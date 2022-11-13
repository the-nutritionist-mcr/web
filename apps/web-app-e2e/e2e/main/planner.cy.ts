import { E2E } from '@tnmw/constants';
import { Planner } from '../../src/pages/planner';
import { Recipes } from '../../src/pages/recipes';

describe('The planner', () => {
  beforeEach(() => {
    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
    // cy.clock(Date.UTC(2022, 13, 1));
  });

  it('You can generate a plan on the recipes page that is then available on the planner', () => {
    Recipes.visit();
    Recipes.getHeader();
    Recipes.clickPlanningMode();
    cy.clock(Date.UTC(2022, 10, 8)).then((clock) => {
      Recipes.clickPickMeals(1);
      Recipes.addRecipeToSelectedCook('PAD THAI');
      Recipes.addRecipeToSelectedCook('7 SPICE CHIX');
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

  it.skip(
    'Customers with an active plan get the correct selection of meals generated for them on the planner'
  );

  it.skip(
    'If a customer is paused on the day of the cook, then no meals are chosen for them'
  );

  it.skip('Clicking on the customers name takes you to the edit customer page');

  it.skip('Clicking the small trash button removes individual recipe entries');

  it.skip('Clicking on the large trash button removes the row');

  it.skip(
    'The add plan row button provides a mechanism to add a row to a customers plan'
  );

  it.skip(
    'When extras rows are added, there is no way of changing the individual option'
  );

  it.skip(
    'For meal plan rows, you can click on the individual recipe entry to change to a different one'
  );

  it.skip('Clicking the plus button adds a recipe to the row');

  it.skip('The pack plan button downloads a PDF');

  it.skip('The pack plan PDF has a page for each cook');

  it.skip('The pack plan correctly marks recipes with customisations');

  it.skip('The pack plan correctly swaps out any alternates');

  it.skip('The planner correctly swaps out any alternates');
});
