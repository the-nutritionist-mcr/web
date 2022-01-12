import { Heading, Header, Button } from "grommet";
import { useDispatch, useSelector } from "react-redux";

import React from "react";
import { allRecipesSelector } from "../recipes/recipesSlice";
import Finalize from "./Finalize";
import { clearPlanner, customerSelectionsSelector } from "./planner-reducer";
import generateDeliveryPlanDocumentDefinition from "../../lib/generateDeliveryPlanDocumentDefinition";
import generateCookPlanDocumentDefinition from "../../lib/generateCookPlanDocumentDefinition";
import fileDownload from "js-file-download";
import generateCsvStringFromObjectArray from "../../lib/generateCsvStringFromObjectArray";
import downloadPdf from "../../lib/downloadPdf";
import { makeCookPlan, generateLabelData } from "../../meal-planning";
import { defaultDeliveryDays } from "../../lib/config";

const Planner: React.FC = () => {
  const dispatch = useDispatch();
  const customerMeals = useSelector(customerSelectionsSelector);
  const recipes = useSelector(allRecipesSelector);

  return (
    <>
      <Header align="center" justify="start" gap="small">
        <Heading level={2}>Planner</Heading>
        <Button
          primary
          size="small"
          label="Pack Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            const plan = generateDeliveryPlanDocumentDefinition(
              customerMeals ?? [],
              recipes
            );
            downloadPdf(plan, "pack-plan.pdf");
          }}
        />
        <Button
          primary
          size="small"
          label="Cook Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            const plan = makeCookPlan(customerMeals ?? [], recipes);
            downloadPdf(
              generateCookPlanDocumentDefinition(plan),
              "cook-plan.pdf"
            );
          }}
        />
        {defaultDeliveryDays.map((value, deliveryIndex) => (
          <Button
            key={`delivery-${deliveryIndex}-labels-button`}
            primary
            size="small"
            label={`Labels ${deliveryIndex + 1}`}
            disabled={Boolean(!customerMeals || !recipes)}
            onClick={() => {
              fileDownload(
                generateCsvStringFromObjectArray(
                  generateLabelData(customerMeals ?? [], recipes, deliveryIndex)
                ),
                "labels.csv"
              );
            }}
          />
        ))}
        <Button
          primary
          size="small"
          label="Reset"
          onClick={(): void => {
            dispatch(clearPlanner());
          }}
        />
      </Header>
      <Finalize />
    </>
  );
};

export default Planner;
