import { Heading, Header, Button } from 'grommet';

import React from 'react';
import Finalize from './Finalize';
import generateDeliveryPlanDocumentDefinition from '../../lib/generateDeliveryPlanDocumentDefinition';
import downloadPdf from '../../lib/downloadPdf';
import { defaultDeliveryDays } from '@tnmw/config';
import {
  Cook,
  Recipe,
  ChangePlanRecipeBody,
  PlanResponseSelections,
} from '@tnmw/types';

interface PlannerProps {
  cooks: Cook[];
  selections: PlanResponseSelections;
  recipes: Recipe[];
  update: (item: ChangePlanRecipeBody) => Promise<void>;
  publish: () => Promise<void>;
  published: boolean;
}

const Planner: React.FC<PlannerProps> = (props) => {
  const customerMeals = props.selections;
  const recipes = props.recipes;

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
            downloadPdf(plan, 'pack-plan.pdf');
          }}
        />
        <Button
          primary
          size="small"
          label="Cook Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            // Noop
          }}
        />
        {defaultDeliveryDays.map((_, deliveryIndex) => (
          <Button
            key={`delivery-${deliveryIndex}-labels-button`}
            primary
            size="small"
            label={`Labels ${deliveryIndex + 1}`}
            disabled={Boolean(!customerMeals || !recipes)}
            onClick={() => {
              // Noop
            }}
          />
        ))}
        {props.published ? (
          <Button
            primary
            size="small"
            label="Publish"
            onClick={props.publish}
          />
        ) : (
          <>This plan has been published</>
        )}
      </Header>
      {props.cooks && (
        <Finalize
          cooks={props.cooks}
          recipes={props.recipes}
          customerMeals={props.selections}
          update={props.update}
        />
      )}
    </>
  );
};

export default Planner;
