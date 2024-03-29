import { E2E } from '@tnmw/constants';
import { Planner } from '../../src/pages/planner';
import { Recipes } from '../../src/pages/recipes';
import { Customers } from '../../src/pages/customers';
import { EditCustomer } from '../../src/pages/edit-customer';
import { PageTablesOutput } from 'pdf-table-extractor';
// eslint-disable-next-line unicorn/prefer-node-protocol
import {
  getDownloadedFilename,
  readDownloadedFile,
} from '../../src/support/cypress-helpers';

const recipes = new Recipes();

const customerNameString = `${E2E.e2eCustomer.surname}, ${E2E.e2eCustomer.firstName}`;
const notReversedName = `${E2E.e2eCustomer.firstName} ${E2E.e2eCustomer.surname}`;

const normalise = (line: string) => line.split(`\n`).join('').trim();

const todaysDatestamp = () => {
  const date = new Date(Date.now());
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

  return `${Number.parseInt(da, 10)}-${Number.parseInt(mo, 10)}-${ye}`;
};

// eslint-disable-next-line fp/no-let
let timeout: NodeJS.Timeout | undefined;

describe('The planner', () => {
  before(() => {
    cy.seed();
    cy.task('deleteFolder', Cypress.config('downloadsFolder'));
    cy.task('deleteChargebeeCustomer', E2E.e2eCustomer.username);
  });

  beforeEach(() => {
    cy.loginByCognitoApi({
      user: E2E.adminUserOne.email,
      password: E2E.adminUserOne.password,
    });
    timeout = setTimeout(() => {
      throw new Error('Timed out');
    }, 10 * 60_000);
  });

  afterEach(() => {
    clearTimeout(timeout);
  });

  it('You can generate a plan on the recipes page that is then available on the planner', () => {
    const user = {
      username: E2E.e2eCustomer.username,
      country: E2E.e2eCustomer.country,
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

    cy.task('waitUntilUserDoesntExist', E2E.e2eCustomer.username).then(() => {
      cy.task('createChargebeeCustomer', user);

      console.log('getting table');
      Customers.visit();
      Customers.getTable().contains(customerNameString, {
        timeout: 5 * 60_000,
      });

      cy.task('addTestCard', E2E.e2eCustomer.username);
      cy.task('addSubscription', {
        customerId: E2E.e2eCustomer.username,
        planId: 'EQ-1-Monthly-5-2022',
        price: 100,
      });

      Customers.getTableRows()
        .contains(customerNameString)
        .parents('tr')
        .contains('EQ-5', { timeout: 5 * 60_000 });

      recipes.visit();
      recipes.getHeader();
      recipes.getPlanningModeButton().click();
      cy.clock(Date.UTC(2022, 10, 8)).then((clock) => {
        recipes.getPickMealsButton(1).click();
        recipes.getAddRecipeToCookCheckbox('PAD THAI').click();
        recipes.getAddRecipeToCookCheckbox('ANCHO BBQ CHIX').click();
        recipes.getAddRecipeToCookCheckbox('ACHIOTE PORK').click();
        recipes.getAddRecipeToCookCheckbox('RICOTTA').click();
        recipes.getAddRecipeToCookCheckbox('BUDDHA BOWL').click();
        recipes.getAddRecipeToCookCheckbox('SAGE RISO').click();
        recipes.selectChooseCookDate(1, new Date(Date.UTC(2022, 10, 13)));

        recipes.getPickMealsButton(2).click();
        recipes.getAddRecipeToCookCheckbox('CHIX ORZO').click();
        recipes.getAddRecipeToCookCheckbox('BEEF BURRITO').click();
        recipes.getAddRecipeToCookCheckbox('TERIYAKI SAL').click();
        recipes.getAddRecipeToCookCheckbox('CHIX ANCHO').click();
        recipes.getAddRecipeToCookCheckbox('SAL HOI SIN').click();
        recipes.getAddRecipeToCookCheckbox('GOAT NUT SAL').click();
        recipes.selectChooseCookDate(2, new Date(Date.UTC(2022, 10, 16)));

        recipes.getSendToPlannerButton().click({ force: true });
        cy.contains('New plan successfully generated!');
        clock.restore();
        Planner.visit();

        cy.contains('Plan generated Today by Cypress Tester');
        cy.contains('This plan has not been published to customers');
      });
    });
  });

  it('Download buttons should be disabled initially', () => {
    Planner.visit();
    Planner.getDownloadsButton().should('be.disabled');
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
    Planner.clickCustomerName('Fake Customer');
    EditCustomer.getHeader();
    cy.contains('Fake Customer');
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

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 0).contains(
      'BUDDHA BOWL'
    );
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

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 0).contains(
      'BABY SPINACH'
    );

    Planner.getPlanRowCell(notReversedName, 1, 'Equilibrium', 1).contains(
      'BUDDHA BOWL'
    );
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

  it('Clicking on the large trash button removes the row', () => {
    Planner.visit();
    Planner.deleteDeliveryRow(notReversedName, 2, 'Equilibrium');
    Planner.getPlanRow(notReversedName, 2, 'Equilibrium').should('not.exist');
  });

  it('The add plan row button provides a mechanism to add a row to a customers plan', () => {
    Planner.visit();
    Planner.addPlanRow(notReversedName, 2, 'Mass');
    Planner.getPlanRow(notReversedName, 2, 'Mass').should('exist');
  });

  it('Clicking the plus button adds a recipe to the row', () => {
    Planner.visit();
    Planner.addToPlan(notReversedName, 2, 'Mass');
    Planner.addToPlan(notReversedName, 2, 'Mass');
    Planner.addToPlan(notReversedName, 2, 'Mass');
    Planner.getPlanRowCell(notReversedName, 2, 'Mass', 0).contains('ORZO');
    Planner.getPlanRowCell(notReversedName, 2, 'Mass', 1).contains('ORZO');
    Planner.getPlanRowCell(notReversedName, 2, 'Mass', 2).contains('ORZO');
  });

  it('Publishing the plan enables the download buttons', () => {
    Planner.visit();
    Planner.clickPublish();
    Planner.getDownloadsButton().should('not.be.disabled');
  });

  it('The pack plan button downloads a PDF', () => {
    Planner.visit();
    Planner.clickDownloadsButton();
    Planner.clickPackPlanButton();
    const filename = `pack-plan-${todaysDatestamp()}.pdf`;
    readDownloadedFile(filename).should((buffer) =>
      expect(buffer.length).to.be.gt(100)
    );
  });

  it('The cook plan button downloads a PDF', () => {
    Planner.visit();
    Planner.clickDownloadsButton();
    Planner.clickCookPlanButton();

    const filename = `cook-plan-${todaysDatestamp()}.pdf`;
    readDownloadedFile(filename).should((buffer) =>
      expect(buffer.length).to.be.gt(100)
    );
  });

  it('The cook plan contains three pages', () => {
    Planner.visit();
    Planner.clickDownloadsButton();
    Planner.clickCookPlanButton();

    const stampedName = `cook-plan-${todaysDatestamp()}.pdf`;

    readDownloadedFile(stampedName).should((buffer) =>
      expect(buffer.length).to.be.gt(100)
    );

    const filename = getDownloadedFilename(stampedName);

    cy.task('extractTable', filename).should((table: PageTablesOutput) => {
      expect(table.numPages).to.eq(3);
    });
  });

  it.skip('The cook plan contains a row for each of the recipes in the first delivery', () => {
    const stampedName = `cook-plan-${todaysDatestamp()}.pdf`;

    readDownloadedFile(stampedName).should((buffer) =>
      expect(buffer.length).to.be.gt(100)
    );

    const filename = getDownloadedFilename(stampedName);

    cy.task('extractTable', filename).should((table: PageTablesOutput) => {
      const cookOne = table.pageTables.find((page) => page.page === 2);
      expect(normalise(cookOne.tables[0][0])).to.eq(
        `TORN CHILLI CHICKEN ‘PAD THAI’ (x 47)`
      );

      expect(normalise(cookOne.tables[1][0])).to.eq(
        `ACHIOTE SLOW COOKED SHOULDER OF PORK (x 48)`
      );

      expect(normalise(cookOne.tables[2][0])).to.eq(
        `ANCHO CHILLI BARBECUE PULLED CHICKEN (x 47)`
      );

      expect(normalise(cookOne.tables[3][0])).to.eq(
        `BABY SPINACH + RICOTTA GRATIN (x 6)`
      );

      expect(normalise(cookOne.tables[4][0])).to.eq(`BUDDHA BOWL (x 5)`);

      expect(normalise(cookOne.tables[5][0])).to.eq(
        `BUTTERNUT SQUASH + SAGE RISOTTO (x 5)`
      );

      expect(normalise(cookOne.tables[6][0])).to.eq(`Breakfast (x 123)`);

      const cookTwo = table.pageTables.find((page) => page.page === 3);

      expect(normalise(cookTwo.tables[0][0])).to.eq(
        `LEMON + HERB ROAST CHICKEN ORZO (x 51)`
      );

      expect(normalise(cookTwo.tables[1][0])).to.eq(
        `SLOW COOKED BEEF BURRITO BOWL (x 47)`
      );

      expect(normalise(cookTwo.tables[2][0])).to.eq(
        `TERIYAKI GLAZED SALMON (x 47)`
      );

      expect(normalise(cookTwo.tables[3][0])).to.eq(
        `ANCHO CHILLI TORN CHICKEN  (x 6)`
      );

      expect(normalise(cookTwo.tables[4][0])).to.eq(
        `AUTUMN SALAD OF FRENCH GOATS’ CHEESE [V] (x 3)`
      );

      expect(normalise(cookTwo.tables[5][0])).to.eq(
        `BLACK + WHITE SESAME ROAST SALMON (x 3)`
      );

      expect(normalise(cookTwo.tables[6][0])).to.eq(`Breakfast (x 164)`);
    });
  });

  it('When extras rows are added, there is no way of changing the individual option', () => {
    Planner.visit();
    Planner.addPlanRow(notReversedName, 2, 'Breakfast');
    Planner.addToPlan(notReversedName, 2, 'Breakfast');
    Planner.addToPlan(notReversedName, 2, 'Breakfast');
    Planner.addToPlan(notReversedName, 2, 'Breakfast');
    Planner.getPlanRowCell(notReversedName, 2, 'Breakfast', 2)
      .find('input')
      .should('not.exist');
  });

  it.skip('The download label data button allows you to download a CSV file for each delivery', () => {
    Planner.visit();
  });

  it.skip(
    'If a customer is paused on the day of the cook, then no meals are chosen for them'
  );

  it.skip('The pack plan PDF has a page for each cook');

  it.skip('The pack plan correctly marks recipes with customisations');

  it.skip('The pack plan correctly swaps out any alternates');

  it.skip('The planner correctly swaps out any alternates');
});
