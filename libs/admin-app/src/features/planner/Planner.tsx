import { Heading, Header, Button } from 'grommet';

import React, { useState } from 'react';
import Finalize from './Finalize';
import generateDeliveryPlanDocumentDefinition from '../../lib/generateDeliveryPlanDocumentDefinition';
import fileDownload from 'js-file-download';
import { generateDatestampedFilename } from '@tnmw/utils';
import {
  Cook,
  Recipe,
  ChangePlanRecipeBody,
  PlanResponseSelections,
  WeeklyCookPlan,
  MealSelectionPayload,
  MealPlanGeneratedForIndividualCustomer,
  BackendCustomer,
} from '@tnmw/types';
import { DownloadLabelsDialog } from '@tnmw/components';
import {
  generateLabelData,
  makeCookPlan,
  performSwaps,
} from '@tnmw/meal-planning';
import generateCsvStringFromObjectArray from '../../lib/generateCsvStringFromObjectArray';
import { downloadPdf } from '@tnmw/pdf';
import generateCookPlanDocumentDefinition from '../../lib/generateCookPlanDocumentDefinition';

interface PlannerProps {
  createdBy: string;
  creationDate: Date;
  plan: WeeklyCookPlan;
  customers: BackendCustomer[];
  recipes: Recipe[];
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
  publish: () => Promise<void>;
  published: boolean;
}

const Planner: React.FC<PlannerProps> = (props) => {
  const recipes = props.recipes;
  const [showLabelsDialog, setShowLabelDialog] = useState(false);

  const customerMeals = props.published && props.plan;

  const swappedPlan = props.plan.customerPlans.map((plan) =>
    performSwaps(plan, plan.customer, recipes)
  );

  return (
    <>
      <Header
        align="center"
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>Planner</Heading>
        {showLabelsDialog && (
          <DownloadLabelsDialog
            onClose={() => setShowLabelDialog(false)}
            onDownload={(useBy, cook) => {
              const data = generateLabelData(swappedPlan, useBy, recipes, cook);
              setShowLabelDialog(false);
              fileDownload(
                generateCsvStringFromObjectArray(data),
                generateDatestampedFilename('labels', 'csv')
              );
            }}
          />
        )}

        <Button
          primary
          size="small"
          label="Pack Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            const plan = generateDeliveryPlanDocumentDefinition(
              swappedPlan,
              recipes
            );
            downloadPdf(plan, 'pack-plan.pdf');
          }}
        />
        <Button
          primary
          size="small"
          label="Cook Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            const plan = makeCookPlan(swappedPlan, recipes);
            downloadPdf(
              generateCookPlanDocumentDefinition(plan),
              generateDatestampedFilename('cook-plan', 'pdf')
            );
          }}
        />
        <Button
          primary
          size="small"
          label="Download Label Data"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            setShowLabelDialog(true);
          }}
        />

        {!props.published && (
          <Button
            primary
            size="small"
            label="Publish"
            onClick={props.publish}
          />
        )}
      </Header>
      {props.plan && (
        <Finalize
          cooks={props.plan.cooks}
          published={props.published}
          recipes={props.recipes}
          customerMeals={props.plan.customerPlans}
          update={props.update}
          creationDate={props.creationDate}
          generatedBy={props.createdBy}
          customers={props.customers}
        />
      )}
    </>
  );
};

export default Planner;
