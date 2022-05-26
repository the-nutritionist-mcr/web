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
} from '@tnmw/types';
import { DownloadLabelsDialog } from '@tnmw/components';
import { generateLabelData, makeCookPlan } from '@tnmw/meal-planning';
import generateCsvStringFromObjectArray from '../../lib/generateCsvStringFromObjectArray';
import { downloadPdf } from '@tnmw/pdf';
import generateCookPlanDocumentDefinition from '../../lib/generateCookPlanDocumentDefinition';

interface PlannerProps {
  cooks: Cook[];
  createdBy: string;
  creationDate: Date;
  selections: PlanResponseSelections;
  recipes: Recipe[];
  update: (item: ChangePlanRecipeBody) => Promise<void>;
  publish: () => Promise<void>;
  published: boolean;
}

const Planner: React.FC<PlannerProps> = (props) => {
  const customerMeals = props.selections;
  const recipes = props.recipes;
  const [showLabelsDialog, setShowLabelDialog] = useState(false);

  return (
    <>
      <Header align="center" justify="start" gap="small">
        <Heading level={2}>Planner</Heading>
        {showLabelsDialog && (
          <DownloadLabelsDialog
            onClose={() => setShowLabelDialog(false)}
            onDownload={(useBy, cook) => {
              const data = generateLabelData(
                customerMeals ?? [],
                useBy,
                recipes,
                cook
              );
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
              customerMeals ?? [],
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
            const plan = makeCookPlan(customerMeals ?? [], recipes);
            downloadPdf(
              generateCookPlanDocumentDefinition(plan),
              generateDatestampedFilename('cook-plan', 'pdf')
            );
            // Noop
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
      {props.cooks && (
        <Finalize
          cooks={props.cooks}
          published={props.published}
          recipes={props.recipes}
          customerMeals={props.selections}
          update={props.update}
          creationDate={props.creationDate}
          generatedBy={props.createdBy}
        />
      )}
    </>
  );
};

export default Planner;
