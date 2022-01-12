import { Paragraph } from "grommet";
import React from "react";
import { useSelector } from "react-redux";
import { allRecipesSelector } from "../recipes/recipesSlice";
import FinalizeCustomerTable from "./FinalizeCustomerTable";
import {
  customerSelectionsSelector,
  plannedMealsSelector
} from "./planner-reducer";

const Finalize: React.FC = () => {
  const customerMeals = useSelector(customerSelectionsSelector);
  const planned = useSelector(plannedMealsSelector);
  const recipes = useSelector(allRecipesSelector);

  if (!customerMeals) {
    return (
      <Paragraph fill>
        You&apos;ve not yet selected any meals to be included in the plan yet.
        You can do this by going to the recipes page and clicking the
        &apos;Planning Mode&apos; button.
      </Paragraph>
    );
  }
  return (
    <>
      <Paragraph fill>
        Please check the selections generated below and make any necessary
        adjustments. If you are happy with this plan, you can use the buttons
        above to download PDFs for the cook and delivery plan. Please note that
        if you make any changes to anything outside this page (such as recipes
        and customers), they will{" "}
        <strong>not automatically be reflected in this plan</strong> until you
        generate a new one via planning mode on the Recipes page.
      </Paragraph>
      {customerMeals
        .slice()
        .sort((a, b) =>
          a.customer.surname.toLowerCase() > b.customer.surname.toLowerCase()
            ? 1
            : // eslint-disable-next-line @typescript-eslint/no-magic-numbers
              -1
        )
        .map(customerPlan => (
          <FinalizeCustomerTable
            key={`${customerPlan.customer.id}-finalize-table`}
            customerSelection={customerPlan}
            deliveryMeals={planned}
            allRecipes={recipes}
            columns={6}
          />
        ))}
    </>
  );
};

export default Finalize;
